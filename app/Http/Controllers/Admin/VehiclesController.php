<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\VehicleCreateResquest;
use App\Http\Requests\Vehicle\VehicleUpdateResquest;
use App\Models\Device;
use App\Models\Driver;
use App\Models\Mark;
use App\Models\TipoMantenimiento;
use App\Models\TypeVehicle;
use App\Models\Vehicle;
use App\Models\VehicleSchedule;
use App\Models\VehiculoMantenimiento;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VehiclesController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::with('marca', 'device')->get();
        return Inertia::render('Admin/Vehicle/index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function listSchedules()
    {
        $vehicles = Vehicle::has('device')->get();
        $list = VehicleSchedule::with(['vehicle', 'driver.persona'])->get();
        return Inertia::render('Admin/Vehicle/Programming/index', [
            'schedules' => $list,
            'drivers' => $this->listDriversDisponibles(),
            'vehicles' => $vehicles
        ]);
    }

    public function registerConductorVehicle(Request $request)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'start_time' => 'required|date|after_or_equal:now',
            'end_time' => 'required|date|after:start_time',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        try {
            // Crear la programación del vehículo
            VehicleSchedule::create($validatedData);
            Driver::findOrFail($validatedData['driver_id'])->update(['status' => false]);
            return redirect()->back()->with(['success' => 'Conductor asignado a vehiculo exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()], 500);
        }
    }

    public function updateConductorVehicle(Request $request, $id)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'start_time' => 'required|date|after_or_equal:now',
            'end_time' => 'required|date|after:start_time',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        try {
            DB::beginTransaction();
            $item = VehicleSchedule::findOrFail($id);
            // Cambiar el estado del conductor solo si es necesario
            if ($validatedData['driver_id'] !== $item->driver_id) {
                Driver::where('id', $item->driver_id)->update(['status' => true]);
                Driver::where('id', $validatedData['driver_id'])->update(['status' => false]);
            }
            // Actualizar la programación del vehículo
            $item->update($validatedData);
            // Confirmar la transacción
            DB::commit();
            return redirect()->back()->with('success', 'Información actualizada exitosamente.');
        } catch (\Throwable $th) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            // Manejo de errores
            return redirect()->back()->with('error', 'Error al asignar vehículo: ' . $th->getMessage());
        }
    }

    public function cancelScheduleVehicle($id)
    {
        try {
            $item = VehicleSchedule::findOrFail($id);
            if ($item->cargas()->where('status', '!=', 'entregado')->where('status', '!=', 'cancelado')->exists()) {
                return back()->with('error', 'Hay cargas con estado diferente a entregado o pendiente.');
            }
            $item->status_time = !$item->status_time;
            $item->update();
            $message = $item->status_time
                ? 'Reactivado correctamente'
                : 'Desactivado correctamente';
            return redirect()->back()->with('success', $message);
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
            $vehicle->responsable_id = Auth::user()->id; // Asignar el responsable
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
            $schedules = $vehicle->schedules()->with('driver.persona')->get();
            $listMantenimientos = VehiculoMantenimiento::where('vehicle_id', $id)->get();
            return Inertia::render('Admin/Vehicle/show', [
                'vehicle' => $vehicle,
                'schedules' => $schedules,
                'listMantenimientos' => $listMantenimientos,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('vehicle.list')->with('error', 'Vehículo no encontrado.');
        } catch (\Exception $e) {
            return redirect()->route('vehicle.list')->with('error', 'Ocurrió un error al obtener los datos. ' . $e);
        }
    }

    public function edit($id)
    {
        $marks = Mark::all();
        $types = TypeVehicle::all();
        $vehicle = Vehicle::find($id);
        $devices = Device::where('status', '!=', 'inactivo')->get();
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
            $vehicle->update($data);

            // Actualizar el estado del dispositivo si se proporciona device_id
            if ($data['device_id'] != $vehicle->device_id) {
                Device::findOrFail($vehicle->device_id)->update(['status' => 'activo']);
                Device::findOrFail($data['device_id'])->update(['status' => 'asignado']);
            }
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
    /**
     * Obtener a los conductores disponibles
     */
    public function listDriversDisponibles()
    {
        return Driver::with('persona')
            ->where('status', true)
            ->whereHas('persona', fn($query) => $query->where('estado', true))
            ->get();
    }

    /** Mantenimientos */
    public function listMantenimientos()
    {
        $vehicles = Vehicle::all();
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
            'vehicle_id' => 'required|exists:vehicles,id',
            'fecha_inicio' => 'required|date|after_or_equal:now',
            'observaciones' => 'required|string|max:255',
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
            'vehicle_id' => 'required|exists:vehicles,id',
            'fecha_inicio' => 'required|date|after_or_equal:now',
            'observaciones' => 'required|string|max:255',
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
}
