<?php

namespace App\Http\Controllers;

use App\Models\AltercationReport;
use App\Models\CargoShipment;
use App\Models\Device;
use App\Models\Geocerca;
use App\Models\VehicleSchedule;
use App\Models\VehiculoMantenimiento;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientDriverController extends Controller
{
    public function showEnvio($id)
    {
        try {
            $envio = CargoShipment::with(['vehicle', 'client', 'conductor.driver'])->findOrFail($id);
            $item = AltercationReport::where('envio_id', $id)->get();

            return Inertia::render('Conductor/showEnvio', [
                'dataCarga' => $envio,
                'altercados' => $item
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function showEnvioClient($id)
    {
        try {
            $idUser = Auth::user()->persona->id;
            $envio = CargoShipment::with([
                'vehicle.device',
                'client',
                'geocerca'
            ])->where('client_id', $idUser)
                ->findOrFail($id);;

            return Inertia::render('Client/show', [
                'envio' => $envio
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function changeStatusShipment($id)
    {
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

    public function showMapMonitoreo($id)
    {
        try {
            $envio = CargoShipment::with([
                'vehicle',
                'client',
                'geocerca'
            ])->findOrFail($id);

            $geocerca = Geocerca::findOrFail($envio->geofence_id);
            $device = Device::find($envio->vehicle->device_id);

            if (is_null($device)) {
                return redirect()->back()->with('error', 'El vehículo no cuenta con un dispositivo de rastreo.');
            }

            return Inertia::render('Conductor/showMapa', [
                'geocerca' => $geocerca,
                'envio' => $envio,
                'device' => $device,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function confirmEntrega($id)
    {
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

    public function mantenimientosVehiculosList()
    {
        $user = Auth::user();
        if (!$user || !$user->persona || !$user->persona->driver) {
            return Inertia::render('Conductor/listMantenimiento', [
                'list' => [],
                'error' => 'No se encontró información del conductor.'
            ]);
        }
        $idDriver = $user->persona->driver->id;

        $vehicleSchedule = VehicleSchedule::where('end_time', '>', now())
            ->where('driver_id', $idDriver)
            ->first();
        $list = collect();

        if ($vehicleSchedule) {
            $carId = $vehicleSchedule->car_id;
            $list = VehiculoMantenimiento::with('vehicle')->where('vehicle_id', $carId)->get();
        }

        return Inertia::render('Conductor/mantenimientos', [
            'mantenimientos' => $list,
            'message' => $list->isEmpty() ? 'No hay mantenimientos disponibles.' : null
        ]);
    }

    public function updateEstatusMantenimiento(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:proceso,terminado',
        ]);
        try {
            // Encuentra el elemento o lanza un error si no existe
            $item = VehiculoMantenimiento::findOrFail($id);
            $item->estado = $validated['status'];
            $item->save();
            return back()->with([
                'success' => 'Confirmación exitosa',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return back()->with([
                'error' => 'Vehículo no encontrado'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error actualizando el estado: ', ['error' => $e]);
            return back()->with([
                'error' => 'Error al confirmar estado'
            ], 500);
        }
    }

    public function updateLocationDevice(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
            ]);
            $device = Device::findOrFail($id);
            $device->last_latitude = $validated['latitude'];
            $device->last_longitude = $validated['longitude'];
            $device->save();

            return response()->json([
                'success' => true,
                'latitude' => $device->last_latitude,
                'longitude' => $device->last_longitude
            ]);
        } catch (\Exception $e) {
            Log::error('Error actualizando la ubicación: ', ['error' => $e]);
            return response()->json(['error' => 'Error actualizando la ubicación'], 500);
        }
    }

    public function createAltercado($id) {
        $envio = CargoShipment::with('vehicle', 'conductor.driver')->findOrFail($id);
        return Inertia::render('Conductor/createAltercado', [
            'dataCarga' => $envio
        ]);
    }

    public function storeReporteAltercados(Request $request)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
            'envio_id' => 'required|numeric|exists:cargo_shipments,id',
            'description' => 'required|string|min:10',
            'last_latitude' => 'required|numeric|between:-90,90',
            'last_longitude' => 'required|numeric|between:-180,180',
        ]);
        try {
            // Crear la programación del vehículo
            AltercationReport::create($validatedData);
            return redirect()->back()->with(['success' => 'Registrado exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al reportar: ' . $th->getMessage()], 500);
        }
    }
}
