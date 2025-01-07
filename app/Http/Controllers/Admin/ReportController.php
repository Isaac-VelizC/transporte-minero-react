<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CargoShipment;
use App\Models\Driver;
use App\Models\Persona;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            // Validate request parameters
            $request->validate([
                'vehiculo' => 'nullable|exists:vehicles,id',
                'cliente' => 'nullable|exists:personas,id',
                'conductor' => 'nullable|exists:personas,id',
                'mes' => 'nullable|integer|min:1|max:12',
                'fecha' => 'nullable|date',
            ]);

            // Dynamic query
            $query = CargoShipment::query();

            // Apply dynamic filters
            $query->when($request->vehiculo, fn($q) => $q->where('car_id', $request->vehiculo))
                ->when($request->cliente, fn($q) => $q->where('client_id', $request->cliente))
                ->when($request->conductor, fn($q) => $q->where('conductor_id', $request->conductor))
                ->when($request->mes, fn($q) => $q->whereMonth('fecha_envio', $request->mes))
                ->when($request->fecha, fn($q) => $q->whereDate('fecha_envio', $request->fecha));

            // Eager load relationships and paginate results
            $results = $query->with(['vehicle', 'conductor', 'client'])->paginate(10);

            // Send data to the view with Inertia
            return Inertia::render('Admin/Reports/index', [
                'clientes' => $this->getClientes(),
                'drivers' => $this->getDrivers(),
                'vehiculos' => $this->getVehiculos(),
                'results' => $results,
            ]);
        } catch (\Throwable $th) {
            // Log the error for debugging
            Log::error('Error filtering cargo shipments: ', ['error' => $th]);

            // Handle errors
            return redirect()->back()->with(['error' => 'Error al realizar la consulta: ' . $th->getMessage()], 500);
        }
    }
}
