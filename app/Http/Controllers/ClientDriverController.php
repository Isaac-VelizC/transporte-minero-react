<?php

namespace App\Http\Controllers;

use App\Models\AltercationReport;
use App\Models\CargoShipment;
use App\Models\CargoShipmentVehicleSchedule;
use App\Models\Device;
use App\Models\Driver;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\RenunciaUser;
use App\Models\RutaDevice;
use App\Models\Vehicle;
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
            $envio = CargoShipment::with(['client'])->findOrFail($id);
            $item = AltercationReport::where('envio_id', $id)->get();
            // Obtener el vehículo del responsable
            $vehicle = Vehicle::where('responsable_id', Auth::id())->first();
            // Verificar si se encontró un vehículo
            $deviceId = $vehicle ? $vehicle->device_id : null;

            return Inertia::render('Conductor/showEnvio', [
                'dataCarga' => $envio,
                'altercados' => $item,

                'device_id' => $deviceId,
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
                'client',
            ])->where('client_id', $idUser)
                ->findOrFail($id);
            $altercados = AltercationReport::with('vehiculo')->where('envio_id', $envio->id)->get();
            $schedules = CargoShipmentVehicleSchedule::with(['vehicle.device'])->where('cargo_shipment_id', $id)->get();
            return Inertia::render('Client/show', [
                'envio' => $envio,
                'altercados' => $altercados,
                'schedules' => $schedules
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
                return redirect()->back()->with('success', 'Estado del envío actualizado correctamente.');
            }
            return redirect()->back()->with('error', 'Estado no válido para la actualización.');
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error updating shipment status: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al actualizar el estado.');
        }
    }

    public function showMapMonitoreo()
    {
        try {
            $userId = Persona::where('user_id', Auth::id())->value('id');

            $car = Vehicle::with('cargoShipments')
                ->where('responsable_id', $userId)
                ->first();

            if (!$car || $car->cargoShipments->isEmpty()) {
                return redirect()->route('dashboard')->with('error', 'No tienes envíos pendientes');
            }

            // Obtener el primer envío del vehículo
            $envio = CargoShipment::with('client')
                ->whereNotIn('status', ['entregado', 'cancelado'])
                ->where('id', $car->cargoShipments->first()->id)
                ->first();

            if (!$envio) {
                return redirect()->route('dashboard')->with('error', 'No tienes envíos pendientes');
            }

            // Obtener las geocercas activas
            $geocercas = Geocerca::where('is_active', true)->get();

            // Verificar si el usuario está asignado al envío como conductor
            $datosEnvios = CargoShipmentVehicleSchedule::where('cargo_shipment_id', $envio->id)
                ->where('conductor_id', $userId)
                ->first();

            if (!$datosEnvios || !$datosEnvios->vehicle) {
                return redirect()->back()->with('error', 'No se encontró un vehículo asignado a este envío.');
            }

            $device = Device::find($datosEnvios->vehicle->device_id);

            if (is_null($device)) {
                return redirect()->back()->with('error', 'El vehículo no cuenta con un dispositivo de rastreo.');
            }

            $item = AltercationReport::where('envio_id', $envio->id)->get();

            return Inertia::render('Conductor/showMapa', [
                'geocercas' => $geocercas,
                'altercados' => $item,
                'envio' => $envio,
                'device' => $device->id,
                'vehicleId' => $datosEnvios->vehicle->id,
                'last_location' => [
                    'latitude' => $device->last_latitude ?? 0,
                    'longitude' => $device->last_longitude ?? 0,
                ],
                'origen' => [
                    'latitude' => $envio->origen_latitude ?? 0,
                    'longitude' => $envio->origen_longitude ?? 0,
                ],
                'destino' => [
                    'latitude' => $envio->client_latitude ?? 0,
                    'longitude' => $envio->client_longitude ?? 0,
                ],
                'status' => $envio->status,
                'googleMapsApiKey' => env('VITE_GOOGLE_KEY_MAPS'),
                'mapBoxsApiKey' => env('VITE_MAPBOX_TOKEN'),
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $envio->id, 'error' => $e]);
            return redirect()->back()->with('error', 'Envío no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function confirmEntrega($id)
    {
        try {
            $item = CargoShipment::findOrFail($id);
            // ** Restaurar el estado de los vehículos anteriores antes de actualizar**
            if (!empty($item->programming)) {
                $previousIds = json_decode($item->programming, true);
                if (is_array($previousIds)) {
                    VehicleSchedule::whereIn('id', $previousIds)->update(['status' => 'libre']);
                } else {
                    Log::error('Formato inválido en los IDs de vehículos anteriores.');
                }
            }
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
            /*if ($item->estado == 'terminado') {
                $item->fecha_fin = Carbon::now();
            }*/
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
            $validated = $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
            ]);

            // Buscar el dispositivo
            $device = Device::findOrFail($id);

            // Evitar guardar coordenadas duplicadas
            if (
                $device->last_latitude == $validated['latitude'] &&
                $device->last_longitude == $validated['longitude']
            ) {
                return response()->json([
                    'success' => true,
                    'message' => 'Ubicación sin cambios.',
                    'latitude' => $device->last_latitude,
                    'longitude' => $device->last_longitude,
                ]);
            }

            // Actualizar coordenadas
            $device->last_latitude = $validated['latitude'];
            $device->last_longitude = $validated['longitude'];
            $device->save();

            // Guardar la ruta del dispositivo
            $rutaDevice = RutaDevice::firstOrNew([
                'envio_id' => $envio_id,
                'device_id' => $device->id
            ]);

            $coordenadas = $rutaDevice->coordenadas ? json_decode($rutaDevice->coordenadas, true) : [];
            $coordenadas[] = [$device->last_latitude, $device->last_longitude];

            $rutaDevice->coordenadas = json_encode($coordenadas);
            $rutaDevice->save();

            // Emitir evento si usas WebSockets
            // event(new LocationUpdated($device));
            // event(new RutaEnvioDeviceUpdated($rutaDevice));

            return response()->json([
                'success' => true,
                'latitude' => $device->last_latitude,
                'longitude' => $device->last_longitude,
                'coordenadas' => $coordenadas,
            ]);
        } catch (\Exception $e) {
            Log::error('Error actualizando ubicación: ' . $e->getMessage());
            return response()->json(['error' => 'Error actualizando la ubicación.'], 500);
        }
    }

    public function createAltercado($id)
    {
        // Obtener el envío con las relaciones necesarias
        $envio = CargoShipment::findOrFail($id);
        // Obtener el ID del usuario autenticado
        $userId = Auth::user()->persona->id;
        // Buscar el envío relacionado con el conductor
        $cargaShipment = $envio->vehicleSchedules()
            ->where('conductor_id', $userId)
            ->first();
        // Verificar si se encontró un cargaShipment
        if (!$cargaShipment) {
            // Manejar el caso donde no se encuentra el cargaShipment
            return redirect()->back()->withErrors(['error' => 'No se encontró el envío asociado al conductor.']);
        }
        // Obtener carId y driverId
        $carId = $cargaShipment->car_id;
        $driverId = Driver::where('persona_id', $userId)->first()->id;

        return Inertia::render('Conductor/createAltercado', [
            'dataCarga' => $envio,
            'carId' => $carId,
            'driverId' => $driverId,
        ]);
    }

    public function storeReporteAltercados(Request $request)
    {
        $validatedData = $request->validate([
            'car_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
            'envio_id' => 'required|numeric|exists:cargo_shipments,id',
            'tipo_altercado' => 'required|string|in:bloqueo,descanso,accidente,fallas,otro',
            'description' => 'required|string|min:10',
            'last_latitude' => 'required|numeric|between:-90,90',
            'last_longitude' => 'required|numeric|between:-180,180',
        ]);
        try {
            // Crear la programación del vehículo
            AltercationReport::create($validatedData);
            return redirect()->route('driver.show.map')->with(['success' => 'Registrado exitosamente.'], 201);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al reportar: ' . $th->getMessage()], 500);
        }
    }

    public function renunciaEnvio(Request $request)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'message' => 'required|string|max:100',
            'vehicle' => 'required|exists:vehicles,id',
            'envio' => 'required|numeric|exists:cargo_shipments,id',
        ]);
        try {
            // Obtener el usuario autenticado y su ID de conductor
            $user = Auth::user();
            $driverId = $user->persona->driver->id;

            // Encuentra el vehículo y su horario asociado en una sola consulta
            $vehicleSchedule = VehicleSchedule::where('driver_id', $driverId)
                ->where('status', 'pendiente')
                ->with(['vehicle', 'driver'])
                ->firstOrFail();

            // Actualiza el responsable del vehículo y cierra el horario
            $vehicleSchedule->vehicle->update(['responsable_id' => null]);
            $vehicleSchedule->driver->update(['status' => true]);
            $vehicleSchedule->update(['driver_id' => null, 'status' => 'cerrado', 'end_time' => Carbon::now()]);

            // Crear la renuncia del usuario
            RenunciaUser::create([
                'message' => $validatedData['message'],
                'vehicle' => $validatedData['vehicle'],
                'envio' => $validatedData['envio'],
                'persona_id' => $user->persona->id,
                'schedule_id' => $vehicleSchedule->id,
            ]);

            return redirect()->route('dashboard')->with('success', 'Renunciaste a la entrega exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard')->with('error', 'Vehículo o envío no encontrado.');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Ocurrió un error al renunciar al envío.');
        }
    }
}
