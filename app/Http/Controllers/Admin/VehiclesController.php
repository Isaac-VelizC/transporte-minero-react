<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\VehicleCreateResquest;
use App\Http\Requests\Vehicle\VehicleUpdateResquest;
use App\Models\Mark;
use App\Models\ModelVehicle;
use App\Models\TypeVehicle;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VehiclesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener todos los usuarios que no tienen el rol 'Admin'
        $items = Vehicle::all();

        // Mapear los datos de los usuarios a la estructura deseada
        $vehicles = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'matricula' => $item->matricula,
                'color' => $item->color,
                'modelo' => $item->modelo,
                'fecha_compra' => $item->fecha_compra,
                'status' => $item->status,
                'capacidad_carga' => $item->capacidad_carga,
            ];
        });

        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Vehicle/index', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $marks = Mark::all();
        $types = TypeVehicle::all();
        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Vehicle/form', [
            'marcas' => $marks,
            'typesVehicle' => $types,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

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
            // Revertir la transacción en caso de error
            DB::rollBack();
            // Registrar el error para depuración
            Log::error('Error al registrar vehículo: ' . $th->getMessage());
            // Redirigir con un mensaje de error
            return redirect()->route('vehicle.list')->with('error', 'No se pudo registrar el vehículo. Inténtalo nuevamente.');
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Obtener la persona con Eager Loading para evitar N+1
            $item = Vehicle::findOrFail($id); // Esto lanzará una excepción si no se encuentra
            // Mapear los datos de la persona a la estructura deseada
            $vehicle = [
                'id' => $item->id,
                'matricula' => $item->matricula,
                'mark_id' => $item->mark_id,
                'type_id' => $item->type_id,
                'modelo' => $item->modelo,
                'color' => $item->color,
                'fecha_compra' => $item->fecha_compra,
                'status' => $item->status,
                'capacidad_carga' => $item->capacidad_carga ?? "",
                'fecha_ultima_revision' => $item->fecha_ultima_revision ?? "",
            ];
            $marks = Mark::all();
            $types = TypeVehicle::all();
            // Retornar la vista utilizando Inertia
            return Inertia::render('Admin/Vehicle/show', [
                'vehicle' => $vehicle,
                'marcas' => $marks,
                'typesVehicle' => $types,
            ]);
        } catch (ModelNotFoundException $e) {
            // Manejo de error si no se encuentra el modelo
            return redirect()->route('vehicle.index')->with('error', 'Usuario no encontrado.');
        } catch (\Exception $e) {
            // Manejo de otros errores
            return redirect()->route('vehicle.index')->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(VehicleUpdateResquest $request, string $id)
    {
        // Iniciar la transacción
        DB::beginTransaction();
        try {
            // Validar y obtener los datos del request
            $data = $request->validated();
            // Buscar el vehículo por ID
            $vehicle = Vehicle::findOrFail($id);
            // Actualizar los datos del vehículo
            $vehicle->update($data);
            // Confirmar la transacción
            DB::commit();
            // Redirigir con un mensaje de éxito
            return redirect()->route('vehicle.list')->with('success', 'Vehículo actualizado con éxito.');
        } catch (\Throwable $th) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            // Registrar el error para depuración
            Log::error('Error al actualizar vehículo: ' . $th->getMessage());
            // Redirigir con un mensaje de error
            return redirect()->route('vehicle.list')->with('error', 'No se pudo actualizar el vehículo. Inténtalo nuevamente.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
