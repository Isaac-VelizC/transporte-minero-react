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
                'precio' => 8000,
            ],
            [
                'nombre' => 'Plata',
                'precio' => 560,
            ],
            [
                'nombre' => 'Estaño',
                'precio' => 2450,
            ],
            [
                'nombre' => 'Zinc',
                'precio' => 1461,
            ],
            [
                'nombre' => 'Plomo',
                'precio' => 1056,
            ],
            [
                'nombre' => 'Cobre',
                'precio' => 2010,
            ],
            [
                'nombre' => 'Antimonio',
                'precio' => 3866,
            ],
            [
                'nombre' => 'Complejo',
                'precio' => 1900,
            ],
            [
                'nombre' => 'Mezclas',
                'precio' => 2500,
            ],
        ];

        DB::table('tipo_minerals')->insert($minerales);
    }
}
