<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function index()
    {
        $devices = Device::all();

        $vehicles = Vehicle::where('status', '!=', 'inactivo')->get();
        return Inertia::render('Admin/Devices/index', [
            'devices' => $devices,
            'vehicles' => $vehicles
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'num_serial' => 'required|string|unique:devices',
            'name_device' => 'required|string',
            'type' => 'required|string|in:Android,IOS',
            'car_id' => 'nullable|exists:vehicles,id',
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
            'name_device' => 'required|string',
            'type' => 'required|string|in:Android,IOS',
            'car_id' => 'required|exists:vehicles,id',
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

}
