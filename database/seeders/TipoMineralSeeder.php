<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoMineralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $minerales = [
            [
                'nombre' => 'Oro',
                'precio' => 85000,
            ],
            [
                'nombre' => 'Plata',
                'precio' => 960,
            ],
            [
                'nombre' => 'Estaño',
                'precio' => 27450,
            ],
            [
                'nombre' => 'Zinc',
                'precio' => 2461,
            ],
            [
                'nombre' => 'Plomo',
                'precio' => 2056,
            ],
            [
                'nombre' => 'Cobre',
                'precio' => 4010,
            ],
            [
                'nombre' => 'Antimonio',
                'precio' => 38666.67,
            ],
            [
                'nombre' => 'Complejo',
                'precio' => 38666.67,
            ],
            [
                'nombre' => 'Mezclas',
                'precio' => 38666.67,
            ],
        ];

        DB::table('tipo_minerals')->insert($minerales);
    }
}
