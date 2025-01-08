<?php

namespace App\Http\Controllers;

use App\Models\CargoShipment;
use App\Models\Driver;
use App\Models\Geocerca;
use App\Models\Persona;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function dashboardPage()
    {
        $idAuthUser = Auth::user()->persona->id;
        $authUserRol = Auth::user()->persona->rol;

        // Inicializar contadores
        $enviosCount = 0;
        $enviosPendienteCount = 0;
        $enviosTransitoCount = 0;
        $enviosEntregadoCount = 0;

        if ($authUserRol === 'cliente') {
            // Clientes
            $enviosQuery = CargoShipment::where('client_id', $idAuthUser);
        } elseif ($authUserRol === 'conductor') {
            // Conductores
            $enviosQuery = CargoShipment::where('conductor_id', $idAuthUser);
        } else {
            // Administrador u otro rol
            $usersCount = User::count();
            $clientesCount = Persona::where('rol', 'cliente')->count();
            $driverCount = Driver::count();
            $vehicleCount = Vehicle::where('status', '!=', 'inactivo')->count();
            $geocercasCount = Geocerca::where('is_active', true)->count();
            $enviosQuery = CargoShipment::query();
        }

        if ($authUserRol === 'cliente' || $authUserRol === 'conductor') {
            // Realizar consultas separadas
            $enviosPendienteCount = (clone $enviosQuery)->where('status', 'pendiente')->count();
            $enviosTransitoCount = (clone $enviosQuery)->where('status', 'en_transito')->count();
            $enviosEntregadoCount = (clone $enviosQuery)->where('status', 'entregado')->count();
            $enviosCount = $enviosQuery->count();
        } else {
            // Contar todos los envíos para administrador
            $enviosCount = $enviosQuery->count();
        }

        return Inertia::render('Dashboard', [
            'usersCount' => $usersCount ?? 0,
            'driverCount' => $driverCount ?? 0,
            'clientesCount' => $clientesCount ?? 0,
            'vehicleCount' => $vehicleCount ?? 0,
            'geocercasCount' => $geocercasCount ?? 0,
            'enviosCount' => $enviosCount,
            'enviosPendienteCount' => $enviosPendienteCount,
            'enviosTransitoCount' => $enviosTransitoCount,
            'enviosEntregadoCount' => $enviosEntregadoCount,
        ]);
    }
}
