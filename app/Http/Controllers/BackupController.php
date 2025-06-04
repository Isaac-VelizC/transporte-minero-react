<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupController extends Controller
{
    public function pageCopiasSeguridad()
    {
        $disk = Storage::disk('local');
        // Obtener los archivos en la carpeta 'backups'
        $files = $disk->files('backups');
        $backups = [];

        foreach ($files as $file) {
            // Recolectamos los datos de cada archivo
            $backups[] = [
                'code' => basename($file), // Se pasa solo el nombre del archivo
                'nombre' => basename($file), // Nombre del archivo (sin ruta)
                'fecha' => date('Y-m-d H:i:s', $disk->lastModified($file)), // Fecha de última modificación
                'size' => $disk->size($file), // Tamaño del archivo (opcional)
                'url' => Storage::url($file), // La URL pública del archivo (opcional, para descarga)
            ];
        }

        // Pasamos la información de los backups a la vista de Inertia
        return Inertia::render('Admin/backup/index', ['backups' => $backups]);
    }

    // Método para ejecutar el backup
    public function runBackup()
    {
        try {
            Artisan::call('backup:run');

            return response()->json([
                'success' => true,
                'message' => 'Backup ejecutado correctamente.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ejecutar el backup: ' . $e->getMessage()
            ], 500);
        }
    }

    public function downloadBackup($file)
    {
        $filePath = 'backups/' . $file;

        if (Storage::disk('local')->exists($filePath)) {
            return Storage::disk('local')->download($filePath);
        }

        return redirect()->back()->with('error', 'El archivo de backup no existe.');
    }

    public function deleteBackup($name)
    {
        $filePath = 'backups/' . $name;

        if (Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->delete($filePath);
            return back()->with('success', 'Backup eliminado exitosamente.');
        }

        return back()->with('error', 'No existe el archivo del backup.');
    }
}
