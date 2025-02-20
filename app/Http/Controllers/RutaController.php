<?php

namespace App\Http\Controllers;

use App\Models\RutaDevice;
use App\Models\RutaPunto;
use App\Models\Vehicle;
use Illuminate\Http\Request;

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
        $rutasDevices = [];
        $lastLocations = [];

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

            // Obtener la última ubicación del dispositivo (última coordenada de la última ruta)
            $lastRoute = $rutas->last();
            if ($lastRoute) {
                $lastCoords = json_decode($lastRoute->coordenadas, true);
                if (!empty($lastCoords)) {
                    $lastLocations[] = [
                        'matricula' => $vehicle->matricula,
                        'conductor' => $vehicle->driver->nombre. ' '. $vehicle->driver->ap_pat,
                        'telefono' => $vehicle->driver->numero ?? '',
                        'device_id' => $device_id,
                        'latitude' => $lastCoords[count($lastCoords) - 1][0], // Última latitud
                        'longitude' => $lastCoords[count($lastCoords) - 1][1] // Última longitud
                    ];
                }
            }
        }

        return response()->json([
            'rutasDevices' => $rutasDevices,
            'lastLocations' => $lastLocations,
        ]);
    }

    public function getUser()
    {
        //
    }
    
    public function getDatosDriverMonitoreo()
    {
        //
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
