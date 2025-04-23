<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function downloadBackup()
    {
        Artisan::call('backup:database');
        $filename = 'database_backup_' . date('YmdHis') . '.sql';
        $filePath = 'backups/' . $filename;
        $disk = Storage::disk('local');

        if ($disk->exists($filePath)) {
            return Storage::download($filePath, $filename);
        } else {
            abort(404, "Backup no encontrado.");
        }
    }
}
