<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Envios\EnviosCreateResquest;
use App\Models\CargoShipment;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\Vehicle;
use App\Models\VehicleSchedule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShipmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $envios = CargoShipment::with([
            'vehicle:id,matricula',
            'client:id,nombre,ap_pat,ap_mat',
            'geocerca:id,name'
        ])
            ->select([
                'id',
                'car_id',
                'programming',
                'client_id',
                'peso',
                'destino',
                'status',
                'fecha_envio',
                'fecha_entrega',
                'notas',
                'geofence_id',
                'client_latitude',
                'client_longitude'
            ])
            ->get()
            ->transform(function ($envio) {
                return [
                    'id' => $envio->id,
                    'car_id' => $envio->car_id,
                    'programming' => $envio->programming,
                    'matricula' => optional($envio->vehicle)->matricula,
                    'client_id' => $envio->client_id,
                    'full_name' => $envio->client
                        ? "{$envio->client->nombre} {$envio->client->ap_pat} {$envio->client->ap_mat}"
                        : null,
                    'peso' => $envio->peso,
                    'destino' => $envio->destino,
                    'status' => $envio->status,
                    'fecha_envio' => $envio->fecha_envio,
                    'fecha_entrega' => $envio->fecha_entrega,
                    'notas' => $envio->notas,
                    'geofence_id' => $envio->geofence_id,
                    'geocerca_name' => optional($envio->geocerca)->name,
                    'client_latitude' => $envio->client_latitude,
                    'client_longitude' => $envio->client_longitude,
                ];
            });

        return Inertia::render('Admin/Shipments/index', [
            'envios' => $envios
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $schedules = VehicleSchedule::with('vehicle')
            ->where('status', 'libre')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'matricula_car' => $schedule->vehicle->matricula,
                ];
            });
        $clientes = Persona::where('rol', 'cliente')->get();
        $geocercas = Geocerca::where('is_active', true)->get();
        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Shipments/form', [
            'schedules' => $schedules,
            'clientes' => $clientes,
            'geocercas' => $geocercas,
            'isEditing' => false
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EnviosCreateResquest $request)
    {
        $validatedData = $request->validated();
        $vehicleSchedule = VehicleSchedule::findOrFail($validatedData['programming']);
        $validatedData['car_id'] = $vehicleSchedule->car_id;
        try {
            CargoShipment::create($validatedData);
            return redirect()->route('envios.list')->with('success', 'Envio creada exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating envio: ' . $e->getMessage());
            return back()->withInput()->with('error', 'No se pudo crear el envio. Intente nuevamente.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('Admin/Shipments/show', [
            'envios' => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $envio = CargoShipment::findOrFail($id);
            //$schedules = VehicleSchedule::where('status', 'libre')->get();
            $schedules = VehicleSchedule::with('vehicle')
            ->where('status', 'libre')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'matricula_car' => $schedule->vehicle->matricula,
                ];
            });
            $clientes = Persona::where('rol', 'cliente')->get();
            $geocercas = Geocerca::where('is_active', true)->get();
            // Retornar la vista utilizando Inertia
            return Inertia::render('Admin/Shipments/form', [
                'shipment' => $envio,
                'clientes' => $clientes,
                'geocercas' => $geocercas,
                'schedules' => $schedules,
                'isEditing' => true
            ]);
        } catch (ModelNotFoundException $e) {
            Log::warning("Intento de editar cergo de envio no existente: {$id}");
            return redirect()->back()->with('error', 'Carga de envio no encontrada');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $item = CargoShipment::findOrFail($id);
            $item->delete = !$item->delete;
            $item->save();
            // Mensaje dinámico basado en el nuevo estado
            $message = $item->delete
                ? 'Envio reactivada exitosamente'
                : 'Envio desactivada exitosamente';

            return redirect()->back()->with('success', $message);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Envio no encontrada');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado el envio: ' . $e->getMessage());
            return redirect()->back()->with('error', 'No se pudo modificar el estado del envio. Inténtalo nuevamente');
        }
    }
}
