<?php

namespace App\Http\Controllers\Admin;

use App\Events\LocationUpdated;
use App\Events\RutaEnvioDeviceUpdated;
use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\RutaDevice;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function index()
    {
        $devices = Device::all();
        return Inertia::render('Admin/Devices/index', [
            'devices' => $devices
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'num_serial' => 'required|string|unique:devices',
            'visorID' => 'required|string|unique:devices',
            'name_device' => 'required|string',
            'type' => 'required|string|in:Android,IOS',
            'status' => 'required|string|in:activo,inactivo',
        ]);

        try {
            //dd($validatedData);
            // Crear el dispositivo
            Device::create($validatedData);
            return redirect()->back()->with('success', 'Dispositivo registrado exitosamente.');
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error al registrar dispositivo: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'num_serial' => 'required|string|unique:devices,num_serial,' . $id,
            'visorID' => 'required|string|unique:devices,visorID,' . $id,
            'name_device' => 'required|string',
            'type' => 'required|string|in:Android,IOS',
            'status' => 'required|string|in:activo,inactivo',
        ]);

        try {
            // Actualizar el dispositivo
            $device = Device::findOrFail($id);
            $device->update($validatedData);

            return redirect()->back()->with('success', 'Dispositivo actualizado exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Dispositivo no encontrado.');
        } catch (\Throwable $th) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error al actualizar dispositivo: ' . $th->getMessage());
        }
    }

    public function getLocations()
    {
        return Device::select('id', 'device_name', 'latitude', 'longitude')->get();
    }

    public function updateDeviceRutMap($id, $envio_id)
    {
        try {
            // Obtener el dispositivo
            $device = Device::findOrFail($id);

            // Obtener o crear la ruta del dispositivo
            $rutaDevice = RutaDevice::firstOrNew([
                'envio_id' => $envio_id,
                'device_id' => $device->id
            ]);

            // Emitir eventos a través de WebSocket
            //event(new LocationUpdated($device));
            //event(new RutaEnvioDeviceUpdated($rutaDevice));

            return response()->json([
                'success' => true,
                'latitude' => $device->last_latitude,
                'longitude' => $device->last_longitude,
                'coordenadas' => $rutaDevice->coordenadas
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error actualizando la ubicación: ' . $e->getMessage()], 500);
        }
    }

    public function validateDevice(Request $request)
    {
        $deviceSerial = $request->input('num_serial'); // Número de serie enviado desde el dispositivo

        // Busca el dispositivo en la base de datos
        $device = Device::where('num_serial', $deviceSerial)->first();

        if (!$device || $device->status !== 'activo') {
            // Si el dispositivo no está registrado o no está activo
            return response()->json([
                'message' => 'Dispositivo no autorizado.',
            ], 403);
        }

        return response()->json([
            'message' => 'Dispositivo validado.',
        ]);
    }
}
