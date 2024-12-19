<?php

namespace App\Http\Controllers;

use App\Models\CargoShipment;
use App\Models\Geocerca;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientDriverController extends Controller
{
    private function formatResponse($envio)
    {
        return [
            'id' => $envio->id,
            'car_id' => $envio->car_id,
            'programming' => $envio->programming,
            'matricula' => optional($envio->vehicle)->matricula,
            'client_id' => $envio->client_id,
            'full_name' => $envio->formatFullName(),
            'peso' => $envio->peso,
            'destino' => $envio->destino,
            'status' => $envio->status,
            'fecha_envio' => $envio->fecha_envio,
            'fecha_entrega' => $envio->fecha_entrega,
            'notas' => $envio->notas,
            'geofence_id' => $envio->geofence_id,
            'client_latitude' => $envio->client_latitude,
            'client_longitude' => $envio->client_longitude,
        ];
    }
    /**
     * Funciones para el Rol Conductor
     */
    public function showEnvio($id)
    {
        try {
            $envio = CargoShipment::with([
                'vehicle:id,matricula',
                'client:id,nombre,ap_pat,ap_mat',
                'geocerca:id,name'
            ])->findOrFail($id);

            // Estructura los datos de respuesta
            $response = $this->formatResponse($envio);

            // Renderiza la vista con los datos del envío
            return Inertia::render('Conductor/showEnvio', [
                'dataCarga' => $response
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }
    public function changeStatusShipment($id) {
        try {
            $item = CargoShipment::findOrFail($id);
            $statusMap = [
                'en_transito' => 'pendiente',
                'pendiente' => 'en_transito',
            ];
            if (array_key_exists($item->status, $statusMap)) {
                $item->status = $statusMap[$item->status];
                $item->save();
                return redirect()->route('driver.envios.list')->with('success', 'Estado del envío actualizado correctamente.');
            }
            return redirect()->route('driver.envios.list')->with('error', 'Estado no válido para la actualización.');
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->route('driver.envios.list')->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error updating shipment status: ', ['error' => $e]);
            return redirect()->route('driver.envios.list')->with('error', 'Ocurrió un error al actualizar el estado.');
        }
    }
    public function showMapMonitoreo($id) {
        try {
            $envio = CargoShipment::with([
                'vehicle:id,matricula',
                'client:id,nombre,ap_pat,ap_mat',
                'geocerca:id,name'
            ])->findOrFail($id);

            // Estructura los datos de respuesta
            $response = $this->formatResponse($envio);
            $geocerca = Geocerca::findOrFail($envio->geofence_id);

            return Inertia::render('Conductor/showMapa', [
                'geocerca' => $geocerca,
                'envio' => $response
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function confirmEntrega($id) {
        try {
            $item = CargoShipment::findOrFail($id);
            $item->status = "entregado";
            $item->save();
            return redirect()->back()->with('success', 'Confirmación de entrega exitosa.');
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error updating shipment status: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al actualizar el estado.');
        }
    }
}
