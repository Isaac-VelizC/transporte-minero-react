<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    protected $signature = 'backup:run';
    protected $description = 'Backup de base de datos y archivos en JSON y ZIP sin mysqldump';

    public function handle()
    {
        try {
            $database = env('DB_DATABASE');
            $this->info("Iniciando backup de la base de datos: $database");

            // 1️⃣ Backup de la base de datos en JSON
            $tables = DB::select("SHOW TABLES");
            $data = [];

            foreach ($tables as $table) {
                $tableName = $table->{"Tables_in_$database"};
                $data[$tableName] = DB::table($tableName)->get();
            }

            $dbBackupFile = 'db-backup-' . now()->format('Y-m-d_H-i-s') . '.json';
            Storage::put("backups/$dbBackupFile", json_encode($data, JSON_PRETTY_PRINT));
            $this->info("Backup de DB generado: backups/$dbBackupFile");

            // 2️⃣ Backup de archivos importantes en ZIP
            $zip = new \ZipArchive();
            $zipFileName = 'files-backup-' . now()->format('Y-m-d_H-i-s') . '.zip';
            $zipPath = storage_path("app/backups/$zipFileName");

            if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
                $files = glob(storage_path('app/public/*'));
                foreach ($files as $file) {
                    if (is_file($file)) {
                        $zip->addFile($file, basename($file));
                    }
                }
                $zip->close();
                $this->info("Backup de archivos generado: backups/$zipFileName");
            } else {
                $this->error("No se pudo crear el zip de archivos");
            }

            $this->info("Backup completado correctamente ✅");
        } catch (\Exception $e) {
            $this->error('Error al ejecutar el backup: ' . $e->getMessage());
        }
    }
}