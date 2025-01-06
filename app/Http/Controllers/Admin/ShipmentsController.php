<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Envios\EnviosCreateResquest;
use App\Http\Requests\Envios\EnviosUpdateResquest;
use App\Models\AltercationReport;
use App\Models\CargoShipment;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\VehicleSchedule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShipmentsController extends Controller
{
    public function index() {
        $envios = CargoShipment::with(['vehicle', 'client'])->get();
        return Inertia::render('Admin/Shipments/index', [
            'envios' => $envios
        ]);
    }
    public function listEnviosConductor()
    {
        $idAuth = Auth::user()->id;
        $envios = $this->getEnviosByUserId($idAuth);
        return Inertia::render('Conductor/listEnviosConducto', [
            'envios' => $envios
        ]);
    }
    
    public function listEnviosCliente()
    {
        $idAuth = Auth::user()->id;
        try {
            $envios = CargoShipment::with(['vehicle', 'client'])
                ->whereHas('client', function ($query) use ($idAuth) {
                    $query->where('user_id', $idAuth);
                })
                ->get();
            return Inertia::render('Client/listEnvios', [
                'envios' => $envios
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching shipments: ', ['error' => $e]);
            return redirect()->route('some.route')->with('error', 'Ocurrió un error al obtener los envíos.');
        }
    }
    
    private function getEnviosByUserId($userId)
    {
        return CargoShipment::with(['vehicle', 'client'])
            ->where('conductor_id', $userId)
            ->where('delete', true)
            ->get();
    }

    public function create() {
        $schedules = VehicleSchedule::with('vehicle')
            ->where('status', 'libre')
            ->where('status_time', true)
            ->get();
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
    
    public function store(EnviosCreateResquest $request) {
        $validatedData = $request->validated();
        $vehicleSchedule = VehicleSchedule::findOrFail($validatedData['programming']);
        $validatedData['car_id'] = $vehicleSchedule->car_id;
        $validatedData['conductor_id'] = $vehicleSchedule->driver->persona->user_id;
        try {
            // Crear el envío
            CargoShipment::create($validatedData);
            $vehicleSchedule->update(['status' => 'asignado']);

            return redirect()->route('envios.list')->with('success', 'Envío creado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating envio: ' . $e->getMessage());

            return back()->withInput()->with('error', 'No se pudo crear el envío. Intente nuevamente.');
        }
    }
    
    public function show(string $id) {
        try {
            $envio = CargoShipment::with(['vehicle', 'client', 'conductor'])->findOrFail($id);
            $reportes = AltercationReport::where('envio_id', $id)->get();
            return Inertia::render('Admin/Shipments/show', [
                'datos' => $envio,
                'reportes' => $reportes,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->route('envios.list')->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->route('envios.list')->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function edit(string $id) {
        try {
            $envio = CargoShipment::findOrFail($id);
            $schedules = VehicleSchedule::with('vehicle')
                ->where('status', '!=', 'pendiente')
                ->where('status_time', true)
                ->get();

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
    
    public function update(EnviosUpdateResquest $request, string $id) {
        $validatedData = $request->validated();
        $vehicleSchedule = VehicleSchedule::findOrFail($validatedData['programming']);
        $validatedData['car_id'] = $vehicleSchedule->car_id;
        $validatedData['conductor_id'] = $vehicleSchedule->driver->persona->user_id;
        try {
            CargoShipment::findOrFail($id)->update($validatedData);
            $vehicleSchedule->update(['status' => 'asignado']);
            return redirect()->route('envios.list')->with('success', 'Envío actualizado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating envio: ' . $e->getMessage());

            return back()->withInput()->with('error', 'No se pudo crear el envío. Intente nuevamente.');
        }
    }
    
    public function changeStatus(string $id) {
        try {
            $item = CargoShipment::findOrFail($id);
            $item->status = $item->delete ? 'cancelado' : 'pendiente';
            $item->delete = !$item->delete;
            $item->save();
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
