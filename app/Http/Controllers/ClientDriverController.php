<?php

namespace App\Http\Controllers;

use App\Events\LocationUpdated;
use App\Events\RutaEnvioDeviceUpdated;
use App\Models\AltercationReport;
use App\Models\CargoShipment;
use App\Models\Device;
use App\Models\Geocerca;
use App\Models\RutaDevice;
use App\Models\VehicleSchedule;
use App\Models\VehiculoMantenimiento;
use Carbon\Carbon;
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
            $envio = CargoShipment::with(['vehicle.device', 'client', 'conductor.driver'])->findOrFail($id);
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
                ->findOrFail($id);
            $altercados = AltercationReport::where('envio_id', $envio->id)->get();

            return Inertia::render('Client/show', [
                'envio' => $envio,
                'altercados' => $altercados
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
            $rutaEnvioDevice = RutaDevice::where('envio_id', $id)
                ->where('device_id', $device->id)
                ->first();

            if (is_null($device)) {
                return redirect()->back()->with('error', 'El vehículo no cuenta con un dispositivo de rastreo.');
            }
            return Inertia::render('Conductor/showMapa', [
                'geocerca' => $geocerca,
                'envio' => $envio,
                'device' => $device,
                'rutaEnvioDevice' => $rutaEnvioDevice
            ]);
        } catch (ModelNotFoundException $e) {
            dd($e);
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
        $vehicleSchedule = VehicleSchedule::where('driver_id', $idDriver)->first();
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
            $item = VehiculoMantenimiento::findOrFail($id);
            $item->estado = $validated['status'];
            if ($item->estado == 'terminado') {
                $item->fecha_fin = Carbon::now();
            }
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

    public function updateLocationDevice(Request $request, $id, $envio_id)
    {
        try {
            // Validación de las coordenadas
            $validated = $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
            ]);
            // Obtener el dispositivo
            $device = Device::findOrFail($id);
            // Actualizar las coordenadas del dispositivo
            $device->last_latitude = $validated['latitude'];
            $device->last_longitude = $validated['longitude'];
            $device->save();
            // Obtener las coordenadas actuales (o inicializarlas si es la primera vez)
            $rutaDevice = RutaDevice::firstOrNew(
                [
                    'envio_id' => $envio_id,
                    'device_id' => $device->id
                ]
            );
            // Si ya existen coordenadas, decodificarlas; si no, inicializar un array vacío
            if ($rutaDevice->coordenadas) {
                $coordenadas = json_decode($rutaDevice->coordenadas, true);
            } else {
                $coordenadas = [];
            }
            // Agregar nuevas coordenadas al array
            $coordenadas[] = [$device->last_latitude, $device->last_longitude];
            // Guardar las coordenadas actualizadas como JSON
            $rutaDevice->coordenadas = json_encode($coordenadas);
            $rutaDevice->save();

            // Emitir evento a través de WebSocket
            //event(new LocationUpdated($device));
            //event(new RutaEnvioDeviceUpdated($rutaDevice));

            return response()->json([
                'success' => true,
                'latitude' => $device->last_latitude,
                'longitude' => $device->last_longitude,
                'coordenadas' => $rutaDevice->coordenadas,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error actualizando la ubicación: ' . $e->getMessage()], 500);
        }
    }

    public function createAltercado($id)
    {
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
            return redirect()->route('driver.envio.show', $validatedData['envio_id'])->with(['success' => 'Registrado exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al reportar: ' . $th->getMessage()], 500);
        }
    }
}
