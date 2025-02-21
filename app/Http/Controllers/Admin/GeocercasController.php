<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Geocerca\GeocercaCreateResquest;
use App\Http\Requests\Geocerca\GeocercaUpdateResquest;
use App\Models\CargoShipment;
use App\Models\Geocerca;
use App\Models\RutaDevice;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GeocercasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Geocerca::with('creator')->get();
        return Inertia::render('Admin/Map/Geocercas/index', [
            'geocercas' => $items
        ]);
    }
    /**
     * Mostrar geocercas en el mapa
     */
    public function showMap($id)
    {
        // Obtener el envío con vehículos y dispositivos asociados
        $envio = CargoShipment::with(['vehicleSchedules.vehicle.device', 'altercadoReports'])
            ->findOrFail($id);

        // Obtener los vehículos con sus dispositivos
        $vehiclesShipments = $envio->vehicleSchedules()
            ->with(['vehicle.device', 'vehicle.driver'])
            ->get();

        $rutasDevices = [];
        $lastLocations = [];

        foreach ($vehiclesShipments as $shipment) {
            if ($shipment->vehicle && $shipment->vehicle->device) {
                $device = $shipment->vehicle->device;

                // Obtener todas las rutas del dispositivo para el envío
                $rutas = RutaDevice::where('device_id', $device->id)
                    ->where('envio_id', $id)
                    ->orderBy('created_at')
                    ->get();

                $coordenadas = [];
                foreach ($rutas as $ruta) {
                    // Decodificar coordenadas (asumiendo que están en JSON)
                    $coords = json_decode($ruta->coordenadas, true);
                    if (is_array($coords)) {
                        $coordenadas = array_merge($coordenadas, $coords);
                    }
                }

                if (!empty($coordenadas)) {
                    $rutasDevices[] = [
                        'device_id' => $device->id,
                        'ruta' => $coordenadas
                    ];
                }

                // Obtener la última ubicación (última coordenada del último registro)
                $lastRoute = $rutas->last();
                if ($lastRoute) {
                    $lastCoords = json_decode($lastRoute->coordenadas, true);
                    if (!empty($lastCoords)) {
                        $lastLocations[] = [
                            'conductor' => $shipment->vehicle->driver->nombre. ' '. $shipment->vehicle->driver->ap_pat,
                            'device_id' => $device->id,
                            'latitude' => $lastCoords[count($lastCoords) - 1][0], // Última latitud
                            'longitude' => $lastCoords[count($lastCoords) - 1][1] // Última longitud
                        ];
                    }
                }
            }
        }

        $geocercas = Geocerca::where('is_active', true)->get();
        return Inertia::render('Admin/Map/index', [
            'googleMapsApiKey' => env('VITE_GOOGLE_KEY_MAPS'),
            'mapBoxsApiKey' => env('VITE_MAPBOX_TOKEN'),
            'envio' => $envio,
            'altercados' => $envio->altercadoReports,
            'vehicles' => $vehiclesShipments,
            'rutasDevices' => $rutasDevices,
            'lastLocations' => $lastLocations,
            'geocercas' => $geocercas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Map/Geocercas/form', [
            'isEditing' => false
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(GeocercaCreateResquest $request)
    {
        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::id();
        try {
            Geocerca::create($validatedData);
            return redirect()
                ->route('geocerca.list')
                ->with('success', 'Geocerca creada exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating geocerca: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'No se pudo crear la geocerca. Intente nuevamente.');
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);
            return Inertia::render('Admin/Map/Geocercas/form', [
                'geocerca' => $geocerca,
                'isEditing' => true
            ]);
        } catch (ModelNotFoundException $e) {
            Log::warning("Intento de editar geocerca no existente: {$id}");
            return redirect()->back()->with('error', 'Geocerca no encontrada');
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(GeocercaUpdateResquest $request, string $id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);
            $validatedData = $request->validated();
            $changes = collect($validatedData)
                ->filter(function ($value, $key) use ($geocerca) {
                    return $geocerca->{$key} !== $value;
                })
                ->toArray();
            // Si hay cambios, actualizar
            if (!empty($changes)) {
                $geocerca->fill($changes);
                if (!isset($changes['created_by'])) {
                    $geocerca->created_by = $geocerca->created_by;
                }
                $geocerca->save();
                return redirect()
                    ->route('geocerca.list')
                    ->with('success', 'Geocerca actualizada exitosamente');
            }
            return redirect()->back()->with('info', 'No se detectaron cambios en la geocerca');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Geocerca no encontrada');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'No se pudo actualizar la geocerca. Intente nuevamente.');
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);
            // Alternar el estado de activación
            $geocerca->is_active = !$geocerca->is_active;
            $geocerca->save();
            // Mensaje dinámico basado en el nuevo estado
            $message = $geocerca->is_active
                ? 'Geocerca reactivada exitosamente'
                : 'Geocerca desactivada exitosamente';
            return redirect()->back()->with('success', $message);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Geocerca no encontrada');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado de geocerca: ' . $e->getMessage());

            return redirect()->back()->with('error', 'No se pudo modificar el estado de la geocerca. Inténtalo nuevamente');
        }
    }
}
