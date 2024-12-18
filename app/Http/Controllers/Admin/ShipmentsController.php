<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Envios\EnviosCreateResquest;
use App\Models\CargoShipment;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\VehicleSchedule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShipmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $envios = $this->getEnvios();
        return Inertia::render('Admin/Shipments/index', [
            'envios' => $envios
        ]);
    }
    /**
     * Lista de Envios por conductor
     */
    public function listEnviosConductor()
    {
        $idAuth = Auth::user()->id;
        $envios = $this->getEnviosByUserId($idAuth);
        return Inertia::render('Conductor/listEnviosConducto', [
            'envios' => $envios
        ]);
    }
    /**
     * Lista de Envios por cliente
     */
    public function listEnviosCliente()
    {
        $idAuth = Auth::user()->id;

        try {
            $envios = CargoShipment::with([
                'vehicle:id,matricula',
                'client:id,nombre,ap_pat,ap_mat'
            ])
                ->whereHas('client', function ($query) use ($idAuth) {
                    $query->where('user_id', $idAuth);
                })
                ->get()
                ->map(function ($envio) {
                    return $this->transformEnvio($envio);
                });
            return Inertia::render('Client/listEnvios', [
                'envios' => $envios
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching shipments: ', ['error' => $e]);
            return redirect()->route('some.route')->with('error', 'Ocurrió un error al obtener los envíos.');
        }
    }
    /**
     * Fetch and transform envios for all users.
     */
    private function getEnvios()
    {
        return CargoShipment::with([
            'vehicle:id,matricula',
            'client:id,nombre,ap_pat,ap_mat'
        ])
            ->get()
            ->map(function ($envio) {
                return $this->transformEnvio($envio);
            });
    }
    /**
     * Fetch and transform envios by user ID.
     */
    private function getEnviosByUserId($userId)
    {
        return CargoShipment::with([
            'vehicle:id,matricula',
            'client:id,nombre,ap_pat,ap_mat'
        ])
            ->where('conductor_id', $userId)
            ->where('delete', true)
            ->get()
            ->map(function ($envio) {
                return $this->transformEnvio($envio);
            });
    }
    /**
     * Transform the shipment data.
     */
    private function transformEnvio($envio)
    {
        return [
            'id' => $envio->id,
            'car_id' => $envio->car_id,
            'programming' => $envio->programming,
            'matricula' => optional($envio->vehicle)->matricula,
            'client_id' => $envio->client_id,
            'full_name' => $envio->formatFullName(),
            'destino' => $envio->destino,
            'status' => $envio->status,
            'delete' => $envio->delete,
            'fecha_envio' => $envio->fecha_envio,
            'fecha_entrega' => $envio->fecha_entrega,
            'peso' => $envio->peso,
            'notas' => $envio->notas,
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $schedules = VehicleSchedule::with('vehicle')
            ->where('status', 'libre')
            ->where('status_time', true)
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'matricula_car' => $schedule->vehicle->matricula,
                ];
            });
        $clientes = Persona::where('rol', 'cliente')->where('estado', true)->get();
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
        // Validar los datos de entrada
        $validatedData = $request->validated();

        // Obtener la programación del vehículo
        $vehicleSchedule = VehicleSchedule::findOrFail($validatedData['programming']);

        // Asignar car_id y conductor_id desde la programación
        $validatedData['car_id'] = $vehicleSchedule->car_id;
        $validatedData['conductor_id'] = $vehicleSchedule->driver->persona->user_id;

        try {
            // Crear el envío
            CargoShipment::create($validatedData);

            // Actualizar el estado de la programación
            $vehicleSchedule->update(['status' => 'asignado']);

            return redirect()->route('envios.list')->with('success', 'Envío creado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating envio: ' . $e->getMessage());

            return back()->withInput()->with('error', 'No se pudo crear el envío. Intente nuevamente.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Retrieve the shipment with related models
            $envio = CargoShipment::with([
                'vehicle:id,matricula',
                'client:id,nombre,ap_pat,ap_mat',
                'geocerca:id,name'
            ])->findOrFail($id);

            // Structure the response data
            $response = [
                'id' => $envio->id,
                'car_id' => $envio->car_id,
                'programming' => $envio->programming,
                'matricula' => optional($envio->vehicle)->matricula,
                'client_id' => $envio->client_id,
                'full_name' => optional($envio->client)
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

            // Render the view with the shipment data
            return Inertia::render('Admin/Shipments/show', [
                'datos' => $response
            ]);
        } catch (ModelNotFoundException $e) {
            // Log the error for debugging
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            // Redirect with error message
            return redirect()->route('envios.list')->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            // Log other errors
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            // Redirect with a generic error message
            return redirect()->route('envios.list')->with('error', 'Ocurrió un error al obtener los datos.');
        }
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
                ->where('status_time', true)
                ->get()
                ->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'matricula_car' => $schedule->vehicle->matricula,
                    ];
                });

            $clientes = Persona::where('rol', 'cliente')->where('estado', true)->get();
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
    public function changeStatus(string $id)
    {
        try {
            $item = CargoShipment::findOrFail($id);
            $item->status = $item->delete ? 'cancelado' : 'pendiente';
            $item->delete = !$item->delete;
            $item->save();
            // Mensaje dinámico basado en el nuevo estado
            $message = $item->delete
                ? 'Envio reactivada exitosamente'
                : 'Envio cancelado exitosamente';

            return redirect()->back()->with('success', $message);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Envio no encontrada');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado el envio: ' . $e->getMessage());
            return redirect()->back()->with('error', 'No se pudo modificar el estado del envio. Inténtalo nuevamente');
        }
    }
}
