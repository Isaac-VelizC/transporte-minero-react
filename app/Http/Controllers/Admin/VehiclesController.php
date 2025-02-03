<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\VehicleCreateResquest;
use App\Http\Requests\Vehicle\VehicleUpdateResquest;
use App\Models\CargoShipment;
use App\Models\CargoShipmentVehicleSchedule;
use App\Models\Device;
use App\Models\Driver;
use App\Models\Mark;
use App\Models\RenunciaUser;
use App\Models\TipoMantenimiento;
use App\Models\TypeVehicle;
use App\Models\Vehicle;
use App\Models\VehicleSchedule;
use App\Models\VehiculoMantenimiento;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VehiclesController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::with('marca', 'device')->latest()->get();
        return Inertia::render('Admin/Vehicle/index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function availableResources()
    {
        try {
            $drivers = Driver::with('persona')
                ->where('status', true)
                ->whereHas('persona', fn($query) => $query->where('estado', true))->get();

            return response()->json([
                'drivers' => $drivers,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error processing request: ' . $e->getMessage()], 500);
        }
    }

    public function listSchedules()
    {
        $list = VehicleSchedule::with(['vehicle', 'driver.persona'])->get();
        return Inertia::render('Admin/Vehicle/Programming/index', [
            'schedules' => $list,
        ]);
    }

    public function reasignacionDriverVehicleEnvio(Request $request, $id)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        try {
            $item = RenunciaUser::findOrFail($id);
            // Crear un nuevo horario de vehículo
            $nuevoSchedule = VehicleSchedule::create($validatedData);
            // Obtener el conductor y actualizar su estado
            $driver = Driver::findOrFail($validatedData['driver_id']);
            $driver->update(['status' => false]);
            // Actualizar el responsable del vehículo
            Vehicle::where('id', $item->vehicle)->update(['responsable_id' => $driver->persona->id]);
            // Actualizar el envío asociado al horario del vehículo
            CargoShipmentVehicleSchedule::where('cargo_shipment_id', $item->envio)
                ->where('vehicle_schedule_id', $item->schedule_id)
                ->update([
                    'vehicle_schedule_id' => $nuevoSchedule->id,
                    'conductor_id' => $validatedData['driver_id']
                ]);

            return redirect()->back()->with('success', 'Conductor asignado a vehículo exitosamente.');
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error al asignar vehículo: ' . $th->getMessage());
        }
    }

    public function registerConductorVehicle(Request $request)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);
        try {
            VehicleSchedule::create($validatedData);
            $driver = Driver::findOrFail($validatedData['driver_id']);
            $driver->update(['status' => false]);
            Vehicle::findOrFail($validatedData['car_id'])->update(['responsable_id' => $driver->persona->id]);
            return redirect()->back()->with(['success' => 'Conductor asignado a vehículo exitosamente.']);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()]);
        }
    }

    public function updateConductorVehicle(Request $request, $id)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);
        try {
            DB::beginTransaction();
            $item = VehicleSchedule::findOrFail($id);
            if ($validatedData['driver_id'] !== $item->driver_id) {
                Driver::where('id', $item->driver_id)->update(['status' => true]);
                $newDriver = Driver::findOrFail($validatedData['driver_id']);
                $newDriver->update(['status' => false]);
                Vehicle::findOrFail($validatedData['car_id'])->update(['responsable_id' => $newDriver->persona->id]);
            }
            $item->update($validatedData);
            DB::commit();
            return redirect()->back()->with('success', 'Información actualizada exitosamente.');
        } catch (\Throwable $th) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            // Manejo de errores
            return redirect()->back()->with('error', 'Error al asignar vehículo: ' . $th->getMessage());
        }
    }

    public function deleteScheduleVehicle($id)
    {
        try {
            $item = VehicleSchedule::findOrFail($id);
            if ($item->cargas()->where('status', '!=', 'entregado')->where('status', '!=', 'cancelado')->exists()) {
                return back()->with('error', 'Hay cargas pendientes.');
            }
            Driver::where('id', $item->driver_id)->update(['status' => true]);
            Vehicle::findOrFail($item->car_id)->update(['responsable_id' => null]);
            $item->delete();
            return redirect()->back()->with('success', 'Eliminado correctamente');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'No encontrado.');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al modificar el estado.');
        }
    }

    public function cancelScheduleVehicle($id)
    {
        try {
            $item = VehicleSchedule::findOrFail($id);
            if ($item->cargas()->where('status', '!=', 'entregado')->where('status', '!=', 'cancelado')->exists()) {
                return back()->with('error', 'Hay cargas pendientes.');
            }
            $item->status_time = !$item->status_time;
            Driver::where('id', $item->driver_id)->update(['status' => true]);
            Vehicle::findOrFail($item->car_id)->update(['responsable_id' => null]);
            $item->save();
            return redirect()->back()->with('success', 'Desactivado correctamente');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'No encontrado.');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al modificar el estado.');
        }
    }

    public function create()
    {
        $marks = Mark::all();
        $types = TypeVehicle::all();
        $devices = Device::where('status', 'activo')->get();
        return Inertia::render('Admin/Vehicle/form', [
            'marcas' => $marks,
            'typesVehicle' => $types,
            'devices' => $devices,
            'isEditing' => false
        ]);
    }

    public function store(VehicleCreateResquest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            // Crear un nuevo vehículo
            $vehicle = new Vehicle($data);
            $vehicle->save();
            // Actualizar el estado del dispositivo si se proporciona device_id
            if (!empty($data['device_id'])) {
                Device::findOrFail($data['device_id'])->update(['status' => 'asignado']);
            }
            // Confirmar la transacción
            DB::commit();
            // Redirigir con un mensaje de éxito
            return redirect()->route('vehicle.list')->with('success', 'Vehículo registrado con éxito.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al registrar vehículo: ' . $th->getMessage());
            return redirect()->route('vehicle.list')->with('error', 'No se pudo registrar el vehículo. Inténtalo nuevamente.');
        }
    }

    public function show(string $id)
    {
        try {
            $vehicle = Vehicle::with(['marca', 'tipo', 'device'])->findOrFail($id);
            $schedules = VehicleSchedule::where('car_id', $vehicle->id)->with('driver.persona')->get();
            $listMantenimientos = VehiculoMantenimiento::where('vehicle_id', $id)->get();
            return Inertia::render('Admin/Vehicle/show', [
                'vehicle' => $vehicle,
                'schedules' => $schedules,
                'listMantenimientos' => $listMantenimientos,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('vehicle.list')->with('error', 'Vehículo no encontrado.');
        } catch (\Exception $e) {

            return redirect()->route('vehicle.list')->with('error', 'Ocurrió un error al obtener los datos. ');
        }
    }

    public function edit($id)
    {
        $marks = Mark::all();
        $types = TypeVehicle::all();
        $vehicle = Vehicle::find($id);
        // Obtener el ID del dispositivo asociado al vehículo
        $deviceId = $vehicle->device_id;
        // Obtener dispositivos activos más el dispositivo asociado al vehículo
        $devices = Device::where('status', 'activo')
            ->orWhere('id', $deviceId)
            ->get();
        return Inertia::render('Admin/Vehicle/form', [
            'marcas' => $marks,
            'typesVehicle' => $types,
            'vehicle' => $vehicle,
            'devices' => $devices,
            'isEditing' => true
        ]);
    }

    public function update(VehicleUpdateResquest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $vehicle = Vehicle::findOrFail($id);
            // Actualizar el estado del dispositivo si se proporciona device_id
            if ($data['device_id'] != $vehicle->device_id) {
                Device::findOrFail($vehicle->device_id)->update(['status' => 'activo']);
                Device::findOrFail($data['device_id'])->update(['status' => 'asignado']);
            }
            $vehicle->update($data);
            DB::commit();
            return redirect()->route('vehicle.list')->with('success', 'Vehículo actualizado con éxito.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al actualizar vehículo: ' . $th->getMessage());
            return redirect()->route('vehicle.list')->with('error', 'No se pudo actualizar el vehículo. Inténtalo nuevamente.');
        }
    }

    public function destroy(string $id, Request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:activo,mantenimiento,inactivo'
        ]);
        try {
            $item = Vehicle::findOrFail($id);
            $item->status = $validatedData['status'];
            $item->update();
            return redirect()->back()->with('success', 'Vehiculo cambio de estado correctamente');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Vehiculo no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado del Vehiculo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al modificar el estado del usuario.');
        }
    }

    /** Mantenimientos */
    public function listMantenimientos()
    {
        // Obtener los IDs de los vehículos que tienen mantenimientos pendientes
        $vehiclesWithPendingMaintenance = VehiculoMantenimiento::whereIn('estado', ['pendiente', 'proceso'])
            ->pluck('vehicle_id');
        // Obtener todos los vehículos que no están en la lista anterior
        $vehicles = Vehicle::whereNotIn('id', $vehiclesWithPendingMaintenance)->get();
        $list = VehiculoMantenimiento::with(['vehicle', 'tipo'])->get();
        $tipos = TipoMantenimiento::all();
        return Inertia::render('Admin/Vehicle/Mantenimientos/index', [
            'mantenimientos' => $list,
            'tipos' => $tipos,
            'vehicles' => $vehicles
        ]);
    }

    public function storeMantenimientoVehicle(Request $request)
    {
        $validatedData = $request->validate([
            'taller' => 'required|string',
            'vehicle_id' => 'required|exists:vehicles,id',
            'fecha_inicio' => 'required|date|after_or_equal:today', // Cambiado a today
            'fecha_fin' => 'required|date|after:fecha_inicio', // Correcto
            'observaciones' => 'nullable|string|max:255',
            'tipo' => 'required|numeric|exists:tipo_mantenimientos,id'
        ]);
        try {
            VehiculoMantenimiento::create($validatedData);
            return redirect()->back()->with(['success' => 'Mantenimiento programado exitosamente.'], 201);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error al progrmar mantenimiento: ' . $th->getMessage()], 500);
        }
    }

    public function updateMantenimientoVehicle(Request $request, $id)
    {
        $validatedData = $request->validate([
            'taller' => 'required|string',
            'vehicle_id' => 'required|exists:vehicles,id',
            'fecha_inicio' => 'required|date|after_or_equal:today', // Cambiado a today
            'fecha_fin' => 'required|date|after:fecha_inicio', // Correcto
            'observaciones' => 'nullable|string|max:255',
            'tipo' => 'required|numeric|exists:tipo_mantenimientos,id'
        ]);

        try {
            VehiculoMantenimiento::findOrFail($id)->update($validatedData);
            return redirect()->back()->with(['success' => 'Actualización realizada exitosamente.'], 201);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error al actualizar la infomración: ' . $th->getMessage()], 500);
        }
    }

    public function destroyMantenimientoVehicle($id)
    {
        try {
            VehiculoMantenimiento::findOrFail($id)->delete();
            return redirect()->back()->with(['success' => 'Mantenimiento de vehiculo eliminado exitosamente.'], 201);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error al eliminar mantenimiento de vehículo: ' . $th->getMessage()], 500);
        }
    }
    public function viewMapEnviosAll()
    {
        $envios = CargoShipment::with(['vehicleSchedules.vehicle.device'])->where('status', 'pendiente')->get();
        return Inertia::render('Admin/Map/allEnviosMap', [
            'envios' => $envios
        ]);
    }
}
