<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupDatabase extends Command
{
    protected $signature = 'backup:run';
    protected $description = 'Run a database backup';
    
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $databaseName = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');
            $port = config('database.connections.mysql.port');

            // Crear el nombre del archivo de respaldo
            $backupPath = storage_path('app/backups/' . date('Y-m-d_H-i-s') . '_backup.sql');
            
            // Construir el comando mysqldump
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s --port=%d %s > %s',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($databaseName),
                escapeshellarg($backupPath)
            );

            // Ejecutar el comando mysqldump
            exec($command);

            // Verificar si el archivo de respaldo se creó correctamente
            if (file_exists($backupPath) && filesize($backupPath) > 0) {
                $this->info('Database backup completed');
            } else {
                $this->error('Failed to create database backup');
            }
        } catch (\Exception $e) {
            $this->error('Error al ejecutar el backup: ' . $e->getMessage());
        }
    }
}
