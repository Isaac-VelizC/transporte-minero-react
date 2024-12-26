<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\VehicleCreateResquest;
use App\Http\Requests\Vehicle\VehicleUpdateResquest;
use App\Models\Driver;
use App\Models\Mark;
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
        $items = Vehicle::all();
        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Vehicle/index', [
            'vehicles' => $items,
        ]);
    }

    public function registerConductorVehicle(Request $request)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'start_time' => 'required|date|after_or_equal:now',
            'end_time' => 'required|date|after:start_time',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        try {
            // Crear la programación del vehículo
            VehicleSchedule::create([
                'car_id' => $validatedData['car_id'],
                'start_time' => $validatedData['start_time'],
                'end_time' => $validatedData['end_time'],
                'driver_id' => $validatedData['driver_id'],
            ]);
            Driver::findOrFail($validatedData['driver_id'])->update(['status' => false]);
            return redirect()->back()->with(['success' => 'Vehículo asignado exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()], 500);
        }
    }

    public function updateConductorVehicle(Request $request, $id)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'start_time' => 'required|date|after_or_equal:now',
            'end_time' => 'required|date|after:start_time',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        try {
            // Crear la programación del vehículo
            VehicleSchedule::find($id)->update([
                'start_time' => $validatedData['start_time'],
                'end_time' => $validatedData['end_time'],
                'driver_id' => $validatedData['driver_id'],
            ]);

            return redirect()->back()->with(['success' => 'Informacion actualizado exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()], 500);
        }
    }

    public function create()
    {
        $marks = Mark::all();
        $types = TypeVehicle::all();
        return Inertia::render('Admin/Vehicle/form', [
            'marcas' => $marks,
            'typesVehicle' => $types,
            'isEditing' => false
        ]);
    }

    public function store(VehicleCreateResquest $request)
    {
        // Iniciar la transacción
        DB::beginTransaction();
        try {
            $data = $request->validated();
            // Crear un nuevo vehículo
            $vehicle = new Vehicle($data);
            $vehicle->responsable_id = Auth::user()->id;
            $vehicle->save();
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
            $vehicle = Vehicle::with('schedules.driver.persona')->findOrFail($id);
            // Obtener las programaciones del vehículo
            $schedules = $vehicle->schedules()->with('driver.persona')->get()->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'matricula_car' => $schedule->vehicle->matricula,
                    'car_id' => $schedule->car_id,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                    'driver_id' => $schedule->driver_id,
                    'conductor_name' => $schedule->driver ? $schedule->driver->formatFullName() : 'No asignado',
                    'status' => $schedule->status,
                    'status_time' => $schedule->status_time,
                ];
            });
            $statusTime = $schedules->contains(function ($schedule) {
                return $schedule['status_time'] === 1;
            });
            $listMantenimientos = VehiculoMantenimiento::where('vehicle_id', $id)->get();
            return Inertia::render('Admin/Vehicle/show', [
                'vehicle' => $vehicle,
                'drivers' => $this->listDriversDisponibles(),
                'schedules' => $schedules,
                'statuSchedules' => $statusTime,
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
        return Inertia::render('Admin/Vehicle/form', [
            'marcas' => $marks,
            'typesVehicle' => $types,
            'vehicle' => $vehicle,
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
            ->get()
            ->map(fn($driver) => [
                'id' => $driver->id,
                'full_name' => $driver->formatFullName(),
                'ci' => optional($driver->persona)->ci ?? '',
                'numero' => optional($driver->persona)->numero ?? '',
            ]);
    }

    public function storeMantenimientoVehicle(Request $request)
    {
        $validatedData = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'fecha' => 'required|date|after_or_equal:now',
            'observaciones' => 'required|string|max:255',
        ]);

        try {
            VehiculoMantenimiento::create([
                'vehicle_id' => $validatedData['vehicle_id'],
                'fecha' => $validatedData['fecha'],
                'observaciones' => $validatedData['observaciones'],
            ]);
            return redirect()->back()->with(['success' => 'Vehículo asignado exitosamente.'], 201);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()], 500);
        }
    }

    public function updateMantenimientoVehicle(Request $request, $id)
    {
        $validatedData = $request->validate([
            'fecha' => 'required|date|after_or_equal:now',
            'observaciones' => 'required|string|max:255',
        ]);

        try {
            VehiculoMantenimiento::findOrFail($id)->update([
                'fecha' => $validatedData['fecha'],
                'observaciones' => $validatedData['observaciones'],
            ]);
            return redirect()->back()->with(['success' => 'Vehículo asignado exitosamente.'], 201);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error al asignar vehículo: ' . $th->getMessage()], 500);
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
