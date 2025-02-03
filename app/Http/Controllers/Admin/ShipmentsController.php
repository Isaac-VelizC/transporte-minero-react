<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Envios\EnviosCreateResquest;
use App\Http\Requests\Envios\EnviosUpdateResquest;
use App\Models\AltercationReport;
use App\Models\CargoShipment;
use App\Models\CargoShipmentVehicleSchedule;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\TipoMineral;
use App\Models\Vehicle;
use App\Models\VehicleSchedule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShipmentsController extends Controller
{
    public function index()
    {
        $envios = CargoShipment::with('client')->latest()->get();
        return Inertia::render('Admin/Shipments/index', [
            'envios' => $envios
        ]);
    }
    public function listEnviosConductor()
    {
        $idAuth = Auth::user()->id;
        $item = Vehicle::where('responsable_id', $idAuth)->first();
        $vehicleId = $item ? $item->id : null;
        $envios = $this->getEnviosByUserId($idAuth);
        return Inertia::render('Conductor/listEnviosConducto', [
            'envios' => $envios,
            'vehicleId' => $vehicleId
        ]);
    }

    public function listEnviosCliente()
    {
        $idAuth = Auth::user()->id;
        try {
            $envios = CargoShipment::with(['client'])
                ->whereHas('client', function ($query) use ($idAuth) {
                    $query->where('user_id', $idAuth);
                })->latest()
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
        return CargoShipment::with(['client'])
            ->whereHas('vehicleSchedules', function ($query) use ($userId) {
                $query->where('conductor_id', $userId);
            })
            ->where('delete', true) // Asegúrate de que este sea el nombre correcto del campo
            ->latest('fecha_envio') // Especifica el campo para ordenar
            ->get();
    }

    public function create()
    {
        $schedules = VehicleSchedule::with('vehicle')
            ->where('status', 'libre')
            ->where('status_time', true)
            ->get();
        $clientes = Persona::where('rol', 'cliente')->where('estado', true)->get();
        $geocercas = Geocerca::where('is_active', true)->get();
        $tipoMineral = TipoMineral::all();
        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Shipments/form', [
            'schedules' => $schedules,
            'clientes' => $clientes,
            'geocercas' => $geocercas,
            'isEditing' => false,
            'tipoMineral' => $tipoMineral
        ]);
    }

    public function show(string $id)
    {
        try {
            $envio = CargoShipment::with(['vehicleSchedules.vehicle', 'vehicleSchedules.driver.persona', 'client'])
                ->findOrFail($id);
            $reportes = AltercationReport::where('envio_id', $id)->get();
            return Inertia::render('Admin/Shipments/show', [
                'datos' => $envio,
                'reportes' => $reportes,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('CargoShipment not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->route('envios.list')->with('error', 'Envio no encontrado.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            Log::error('Error retrieving shipment data: ', ['error' => $e]);
            return redirect()->route('envios.list')->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function edit(string $id)
    {
        try {
            $envio = CargoShipment::findOrFail($id);
            $programmingIds = array_map('intval', json_decode($envio->programming));
            $schedules = VehicleSchedule::with('vehicle')
                ->where(function ($query) use ($programmingIds) {
                    $query->whereIn('id', $programmingIds) // Incluir IDs presentes en programming
                        ->orWhere(function ($subQuery) {
                            $subQuery->where('status', '!=', 'pendiente') // Condición para status
                                ->where('status_time', true); // Condición para status_time
                        });
                })
                ->get();
            $clientes = Persona::where('rol', 'cliente')->where('estado', true)->get();
            $tipoMineral = TipoMineral::all();
            // Retornar la vista utilizando Inertia
            return Inertia::render('Admin/Shipments/form', [
                'selects' => $programmingIds,
                'shipment' => $envio,
                'clientes' => $clientes,
                'schedules' => $schedules,
                'isEditing' => true,
                'tipoMineral' => $tipoMineral
            ]);
        } catch (ModelNotFoundException $e) {
            Log::warning("Intento de editar cergo de envio no existente: {$id}");
            return redirect()->back()->with('error', 'Carga de envio no encontrada');
        }
    }

    public function store(EnviosCreateResquest $request)
    {
        return $this->saveShipment(new CargoShipment(), $request, false);
    }

    public function update(EnviosUpdateResquest $request, string $id)
    {
        $item = CargoShipment::findOrFail($id);
        return $this->saveShipment($item, $request, true);
    }

    private function saveShipment(CargoShipment $item, Request $request, Bool $isEditing)
    {
        $request->validate([
            'programming' => 'required|array',
            'programming.*' => 'exists:vehicle_schedules,id',
        ]);

        try {
            $validatedData = $request->validated();
            $vehicleSchedules = VehicleSchedule::findMany($request->programming);
            $totalPeso = $request->peso;
            $totalCapacidad = $vehicleSchedules->sum(fn($v) => $v->vehicle->capacidad_carga);

            if ($totalPeso > $totalCapacidad) {
                return back()->with('error', 'El peso de carga no puede ser mayor a la capacidad total de los camiones: ' . $totalCapacidad);
            }

            // **1️⃣ Restaurar el estado de los vehículos anteriores antes de actualizar**
            if ($isEditing && !empty($item->programming)) {
                $previousIds = json_decode($item->programming, true);

                if (is_array($previousIds)) {
                    VehicleSchedule::whereIn('id', $previousIds)->update(['status' => 'libre']);
                } else {
                    Log::error('Formato inválido en los IDs de vehículos anteriores.');
                }
            }

            // **2️⃣ Guardar el nuevo envío**
            $item->fill($validatedData);
            $item->programming = json_encode($request->programming);
            $item->total = $request->sub_total * $totalPeso;
            $item->save();

            // **3️⃣ Eliminar asociaciones previas antes de insertar las nuevas**
            CargoShipmentVehicleSchedule::where('cargo_shipment_id', $item->id)->delete();

            // **4️⃣ Asociar vehicle schedules seleccionados**
            $data = collect($vehicleSchedules)->map(fn($v) => [
                'cargo_shipment_id' => $item->id,
                'vehicle_schedule_id' => $v->id,
                'car_id' => $v->car_id,
                'conductor_id' => $v->driver->persona_id
            ])->toArray();
            CargoShipmentVehicleSchedule::insert($data);

            // **5️⃣ Actualizar el estado de los nuevos vehículos a "pendiente"**
            VehicleSchedule::whereIn('id', $request->programming)->update(['status' => 'pendiente']);

            $message = 'Envío ' . (!$isEditing ? 'creado' : 'actualizado') . ' exitosamente';
            return redirect()->route('envios.list')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Error en ' . (!$isEditing ? 'creación' : 'actualización') . ' de envío: ' . $e->getMessage());
            return back()->withInput()->with('error', 'No se pudo procesar el envío. Intente nuevamente.');
        }
    }

    public function changeStatus(string $id)
    {
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

    public function altercationsListControler($id)
    {
        $list = AltercationReport::with(['driver.persona', 'vehiculo'])->where('envio_id', $id)->get();
        return Inertia::render('Admin/Shipments/altercations', [
            'altercations' => $list
        ]);
    }
}
