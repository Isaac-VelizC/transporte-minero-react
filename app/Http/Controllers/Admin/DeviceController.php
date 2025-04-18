<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\RutaDevice;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function listDevicesActive()
    {
        $devices = Device::where('status', '!=', 'inactivo')->get();

        if ($devices->isEmpty()) {
            return response()->json(['message' => 'No hay dispositivos activos'], 404);
        }
        return response()->json($devices);
    }

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
            //'visorID' => 'required|string|unique:devices,visorID,' . $id,
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

    public function updateStorageDevice(Request $request, $id)
    {
        try {
            // Buscar el dispositivo antes de validar
            $device = Device::findOrFail($id);

            // Validación manual para capturar errores
            $validatedData = $request->validate([
                'visorID' => 'required|string|max:255|unique:devices,visorID,' . $id . ',id',
            ]);

            // Actualizar el visorID
            $device->visorID = $validatedData['visorID'];
            $device->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Código actualizado exitosamente.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dispositivo no encontrado.'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar código: ' . $th->getMessage()
            ], 500);
        }
    }

    public function getLocations()
    {
        return Device::select('id', 'device_name', 'latitude', 'longitude')->get();
    }

    public function updateDevicesRutaMap(Request $request)
    {
        try {
            // Obtener los IDs de los dispositivos y el ID del envio
            $deviceIds = $request->input('device_ids'); // Array de IDs de dispositivos
            $envio_id = $request->input('envio_id');

            $updatedDevices = [];

            foreach ($deviceIds as $deviceId) {
                // Obtener el dispositivo
                $device = Device::findOrFail($deviceId);

                // Obtener o crear la ruta del dispositivo
                $rutaDevice = RutaDevice::firstOrNew([
                    'envio_id' => $envio_id,
                    'device_id' => $device->id
                ]);

                $updatedDevices[] = [
                    'device_id' => $device->id,
                    'latitude' => $device->last_latitude,
                    'longitude' => $device->last_longitude,
                    'coordenadas' => $rutaDevice->coordenadas
                ];
            }

            return response()->json([
                'success' => true,
                'updated_devices' => $updatedDevices
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
