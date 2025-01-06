<?php

namespace Database\Seeders;

use App\Models\Mark;
use App\Models\TipoMantenimiento;
use App\Models\TypeVehicle;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar MARCAS de vehículos
        Mark::create(['name' => 'VOLVO']);
        Mark::create(['name' => 'SCANIA']);
        Mark::create(['name' => 'MERCEDES-BENZ']);
        Mark::create(['name' => 'DAF']);
        Mark::create(['name' => 'RENAULT']);

        // Insertar tipos de vehículos
        TypeVehicle::create(['name' => 'Camión de Carga']);
        TypeVehicle::create(['name' => 'Camión Volquete']);
        TypeVehicle::create(['name' => 'Camión Mixer']);
        TypeVehicle::create(['name' => 'Camión Grúa']);

        
        TipoMantenimiento::create(['name' => 'Cambios de Aceite']);
        TipoMantenimiento::create(['name' => 'Revisión de Neumáticos']);
        TipoMantenimiento::create(['name' => 'Sistema de Frenos']);
        TipoMantenimiento::create(['name' => 'Sistema de Refrigeración']);
        TipoMantenimiento::create(['name' => 'Control de Batería']);
        TipoMantenimiento::create(['name' => 'Limpieza General']);
    }
}
