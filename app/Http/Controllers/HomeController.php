<?php

namespace App\Http\Controllers;

use App\Models\CargoShipment;
use App\Models\CargoShipmentVehicleSchedule;
use App\Models\Driver;
use App\Models\Geocerca;
use App\Models\Message;
use App\Models\Persona;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function errorPage()
    {
        return Inertia::render('Error/404', [
            'message' => 'Página no encontrada',
            'code' => 404
        ]);
    }

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
        } elseif ($authUserRol === 'Conductor') {
            // Conductores
            $enviosQuery = CargoShipmentVehicleSchedule::where('conductor_id', $idAuthUser)->with('cargoShipment');
        } else {
            // Administrador u otro rol
            $usersCount = User::count();
            $clientesCount = Persona::where('rol', 'cliente')->count();
            $driverCount = Driver::count();
            $vehicleCount = Vehicle::where('status', '!=', 'inactivo')->count();
            $geocercasCount = Geocerca::where('is_active', true)->count();
            $enviosQuery = CargoShipment::query();
        }
        if ($authUserRol === 'Conductor') {
            // Realizar consultas separadas
            $enviosPendienteCount = (clone $enviosQuery)->whereHas('cargoShipment', function ($query) {
                $query->where('status', 'pendiente');
            })->count();
            $enviosTransitoCount = (clone $enviosQuery)->whereHas('cargoShipment', function ($query) {
                $query->where('status', 'en_transito');
            })->count();

            $enviosEntregadoCount = (clone $enviosQuery)->whereHas('cargoShipment', function ($query) {
                $query->where('status', 'entregado');
            })->count();
            $enviosCount = $enviosQuery->whereHas('cargoShipment')->count();
        } elseif ($authUserRol === 'cliente') {
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

    public function viewMessage()
    {
        $messages = Persona::with('messages')->where('rol', 'cliente')->get();
        return Inertia::render('Admin/Message/Index', [
            'messages' => $messages
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'body' => 'required|string|max:255',
        ]);
        try {
            if (!Auth::check() || !Auth::user()->persona) {
                throw new \Exception('Usuario no autenticado o sin persona asociada');
            }
            $encargado = Persona::where('rol', 'encargado_Control')->first();
            if (!$encargado) {
                throw new \Exception('No se encontró un encargado con el rol indicado');
            }
            $message = new Message();
            $message->client_id = Auth::user()->persona->id;
            $message->control_id = $encargado->id;
            $message->body = $request->body;
            $message->receptor = 'cliente';
            $message->fecha = Carbon::now();
            $message->save();
            return redirect()->back()->with('success', 'Mensaje enviado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al enviar el mensaje. Por favor, inténtelo de nuevo.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
        }
    }

    public function sendMessageControl(Request $request)
    {
        $validatedData = $request->validate([
            'body' => 'required|string|max:255',
            'client_id' => 'required|exists:personas,id',
        ]);
        try {
            $message = new Message();
            $message->control_id = Auth::user()->persona->id;
            $message->receptor = 'admin';
            $message->fill($validatedData)->save();
            return redirect()->back()->with('success', 'Mensaje enviado correctamente');
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Error vuelve a intentar: ' . $th->getMessage()], 500);
        }
    }
}
