<?php

namespace App\Http\Controllers;

use App\Models\CargoShipment;
use App\Models\Device;
use App\Models\RutaDevice;
use App\Models\RutaPunto;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RutaController extends Controller
{
    public function guardarPunto(Request $request)
    {
        RutaPunto::create([
            'ruta_id' => $request->input('ruta_id'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        return response()->json(['message' => 'Ubicación guardada']);
    }

    public function obtenerRuta($envio_id, $device_id)
    {
        $puntos = RutaDevice::where('envio_id', $envio_id)
            ->where('device_id', $device_id)
            ->first();

        $coordenadas = $puntos ? json_decode($puntos->coordenadas, true) : [];
        return response()->json($coordenadas);
    }

    public function obtenerRutaAll($envio_id)
    {
        $envioItems = CargoShipment::with('mineral')->findOrFail($envio_id);
        $rutasDevices = [];
        $lastLocations = [];
        $apiKey = env('GOOGLE_MAPS_API_KEY');
        $destino = $envioItems->client_latitude . ',' . $envioItems->client_longitude; // Coordenadas fijas del destino
        // Obtener todas las rutas del envío
        $rutas = RutaDevice::where('envio_id', $envio_id)
            ->orderBy('created_at')
            ->get();

        // Agrupar rutas por `device_id`
        $rutasAgrupadas = $rutas->groupBy('device_id');

        foreach ($rutasAgrupadas as $device_id => $rutas) {
            $coordenadas = [];

            foreach ($rutas as $ruta) {
                // Decodificar coordenadas (asumiendo que es un JSON)
                $coords = json_decode($ruta->coordenadas, true);
                if (is_array($coords)) {
                    $coordenadas = array_merge($coordenadas, $coords);
                }
            }

            if (!empty($coordenadas)) {
                $rutasDevices[] = [
                    'device_id' => $device_id,
                    'ruta' => $coordenadas
                ];
            }

            $vehicle = Vehicle::where('device_id', $device_id)->first();

            // Obtener la última ubicación del dispositivo
            $lastRoute = $rutas->last();
            if ($lastRoute) {
                $lastCoords = json_decode($lastRoute->coordenadas, true);
                if (!empty($lastCoords)) {
                    $lat = $lastCoords[count($lastCoords) - 1][0];
                    $lng = $lastCoords[count($lastCoords) - 1][1];
                    $origen = "$lat,$lng";

                    // 🔹 Consultar Google Distance Matrix API
                    $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=$origen&destinations=$destino&key=$apiKey";
                    $response = Http::get($url);
                    $data = $response->json();

                    // Extraer tiempo estimado si la respuesta es válida
                    $tiempoEstimado = isset($data['rows'][0]['elements'][0]['duration']['text'])
                        ? $data['rows'][0]['elements'][0]['duration']['text']
                        : "Desconocido";

                    $lastLocations[] = [
                        'matricula' => $vehicle->matricula,
                        'conductor' => $vehicle->driver->nombre . ' ' . $vehicle->driver->ap_pat,
                        'carga' => $envioItems->mineral->nombre . ' ' . $envioItems->peso . 't.',
                        'tiempo' => $tiempoEstimado,
                        'device_id' => $device_id,
                        'latitude' => $lat,
                        'longitude' => $lng
                    ];
                }
            }
        }

        return response()->json([
            'rutasDevices' => $rutasDevices,
            'lastLocations' => $lastLocations,
        ]);
    }

    public function updateRutasOffline(Request $request)
    {
        try {
            $validated = $request->validate([
                'rutas' => 'required|array',
                'rutas.*.latitude' => 'required|numeric',
                'rutas.*.longitude' => 'required|numeric',
                'envioId' => 'required|integer|exists:cargo_shipments,id',
                'device' => 'required|integer|exists:devices,id'
            ]);

            // Buscar el dispositivo
            $device = Device::findOrFail($validated['device']);

            // Obtener la última ubicación del array de rutas
            $lastRoute = end($validated['rutas']);

            // Evitar guardar coordenadas duplicadas
            if (
                $device->last_latitude == $lastRoute['latitude'] &&
                $device->last_longitude == $lastRoute['longitude']
            ) {
                return response()->json([
                    'success' => true,
                    'message' => 'Ubicación sin cambios.',
                    'latitude' => $device->last_latitude,
                    'longitude' => $device->last_longitude,
                ]);
            }

            // Actualizar la última ubicación en `devices`
            $device->update([
                'last_latitude' => $lastRoute['latitude'],
                'last_longitude' => $lastRoute['longitude'],
                'last_updated_at' => now(),
            ]);

            // Guardar las rutas en `ruta_devices`
            $rutaDevice = RutaDevice::firstOrCreate([
                'envio_id' => $validated['envioId'],
                'device_id' => $device->id
            ]);

            // Decodificar coordenadas existentes o crear un array nuevo
            $coordenadas = $rutaDevice->coordenadas ? json_decode($rutaDevice->coordenadas, true) : [];

            // Agregar las nuevas rutas al array
            foreach ($validated['rutas'] as $ruta) {
                $coordenadas[] = [$ruta['latitude'], $ruta['longitude']];
            }

            // Guardar nuevamente en la base de datos
            $rutaDevice->update([
                'coordenadas' => json_encode($coordenadas)
            ]);

            return response()->json([
                'success' => true,
                'latitude' => $device->last_latitude,
                'longitude' => $device->last_longitude,
                'coordenadas' => $coordenadas,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error actualizando la ubicación.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTravelTime(Request $request)
    {
        $origin = $request->input('origin'); // Ejemplo: "40.712776,-74.005974"
        $destination = $request->input('destination'); // Ejemplo: "34.052235,-118.243683"
        $apiKey = env('GOOGLE_MAPS_API_KEY');
        $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=$origin&destinations=$destination&key=$apiKey";
        $response = Http::get($url);

        return response()->json($response->json());
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
        //
    }
}
