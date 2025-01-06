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
        // Obtener datos necesarios
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
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'full_name' => $cliente->formatFullName(),
                ];
            });
    }

    private function getDrivers()
    {
        return Driver::with('persona')
            ->get()
            ->map(function ($driver) {
                return [
                    'id' => $driver->id,
                    'full_name' => $driver->formatFullName(),
                    'licencia' => $driver->license_number,
                ];
            });
    }

    private function getVehiculos()
    {
        return Vehicle::where('status', 'activo')
            ->get(['id', 'matricula', 'modelo', 'color']);
    }

    public function filterConsult(Request $request)
    {
        try {
            // Consulta dinámica
            $query = CargoShipment::query();
            // Filtros aplicados dinámicamente
            $query->when($request->vehiculo, fn($q) => $q->where('car_id', $request->vehiculo))
                ->when($request->cliente, fn($q) => $q->where('client_id', $request->cliente))
                ->when($request->conductor, fn($q) => $q->where('conductor_id', $request->conductor))
                ->when($request->mes, fn($q) => $q->whereMonth('fecha_envio', $request->mes))
                ->when($request->fecha, fn($q) => $q->whereDate('fecha_envio', $request->fecha));

            // Relación y resultados
            $results = $query->with(['vehicle', 'conductor', 'client'])->get();
            // Enviar datos a la vista con Inertia
            return Inertia::render('Admin/Reports/index', [
                'clientes' => $this->getClientes(),
                'drivers' => $this->getDrivers(),
                'vehiculos' => $this->getVehiculos(),
                'results' => $results
            ]);
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with(['error' => 'Error al realizar la consulta: ' . $th->getMessage()], 500);
        }
    }
}
