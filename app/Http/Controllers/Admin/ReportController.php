<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CargoShipment;
use App\Models\Driver;
use App\Models\Persona;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $clientes = $this->getClientes();
        $drivers = $this->getDrivers();
        $vehiculos = $this->getVehiculos();
        // Enviar datos a la vista con Inertia
        return Inertia::render('Admin/Reports/index', [
            'clientes' => $clientes,
            'drivers' => $drivers,
            'vehiculos' => $vehiculos,
        ]);
    }

    private function getClientes()
    {
        return Persona::where('rol', 'cliente')
            ->where('estado', true)
            ->get();
    }

    private function getDrivers()
    {
        return Driver::with('persona')->get();
    }

    private function getVehiculos()
    {
        return Vehicle::where('status', 'activo')->get();
    }

    public function filterConsult(Request $request)
    {
        try {
            // Validar los parámetros del request
            $request->validate([
                'vehiculo' => 'nullable|exists:vehicles,id',
                'cliente' => 'nullable|exists:personas,id',
                'conductor' => 'nullable|exists:personas,id',
                'mes' => 'nullable|integer|min:1|max:12',
                'fecha' => 'nullable|date',
            ]);

            // Crear la consulta base
            $query = CargoShipment::query();
            
            // Aplicar filtros dinámicos según los parámetros presentes
            $query->when($request->cliente, fn($q, $cliente) => $q->where('client_id', $cliente))
                //->when($request->vehiculo, fn($q, $vehiculo) => $q->where('car_id', $vehiculo))
                //->when($request->conductor, fn($q, $conductor) => $q->where('conductor_id', $conductor))
                ->when($request->mes, fn($q, $mes) => $q->whereMonth('fecha_envio', $mes))
                ->when($request->fecha, fn($q, $fecha) => $q->whereDate('fecha_envio', $fecha));

            // Eager load de relaciones y paginación
            $results = $query->with(['client', 'vehicleSchedules.vehicle'])->get();

            // Enviar los resultados a la vista con Inertia
            return response()->json([
                'results' => $results,
            ]);
        } catch (\Throwable $th) {
            // Retornar un error manejado
            return redirect()->back()->withErrors(['error' => 'Error al realizar la consulta: ' . $th->getMessage()]);
        }
    }
}
