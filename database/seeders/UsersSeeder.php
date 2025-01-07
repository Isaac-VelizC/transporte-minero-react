<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios y asignar roles
        $usersData = [
            [
                'name' => 'Isaac Veliz',
                'email' => 'isa.veliz@gmail.com',
                'password' => bcrypt('IsaacVelizAdmin'),
                'persona' => [
                    'nombre' => 'Isak',
                    'ap_pat' => 'Veliz',
                    'ci' => '8513987',
                    'genero' => 'Hombre',
                    'rol' => 'admin'
                ],
                'role' => 'Admin',
            ],
            [
                'name' => 'July Croft',
                'email' => 'july.croft@gmail.com',
                'password' => bcrypt('JulyCroft'),
                'persona' => [
                    'nombre' => 'Teagan',
                    'ap_pat' => 'Croft',
                    'ci' => '9828472',
                    'genero' => 'Mujer',
                    'rol' => 'secretaria'
                ],
                'role' => 'Secretaria',
            ],
            [
                'name' => 'Adrian Starr',
                'email' => 'adrian.starr@gmail.com',
                'password' => bcrypt('AdrianStarr'),
                'persona' => [
                    'nombre' => 'Rachel',
                    'ap_pat' => 'Starr',
                    'ci' => '9813742',
                    'genero' => 'Mujer',
                    'rol' => 'encargado_Control'
                ],
                'role' => 'Encargado_Control',
            ],
            [
                'name' => 'rosa List',
                'email' => 'rosa.list@gmail.com',
                'password' => bcrypt('RosaList'),
                'persona' => [
                    'nombre' => 'Peyton',
                    'ap_pat' => 'List',
                    'ci' => '2938343',
                    'genero' => 'Mujer',
                    'rol' => 'cliente'
                ],
                'role' => 'Cliente',
            ],
            [
                'name' => 'Juan Park',
                'email' => 'juan.park@gmail.com',
                'password' => bcrypt('JuanPark'),
                'persona' => [
                    'nombre' => 'Sandara',
                    'ap_pat' => 'Park',
                    'ci' => '2843921',
                    'genero' => 'Mujer',
                    'rol' => 'conductor'
                ],
            ],
            [
                'name' => 'Pablo Denis',
                'email' => 'ticona59@gmail.com',
                'password' => bcrypt('PabloDenisAdmin'),
                'persona' => [
                    'nombre' => 'Pablo',
                    'ap_pat' => 'Denis',
                    'ci' => '9835432',
                    'genero' => 'Hombre',
                    'rol' => 'admin'
                ],
                'role' => 'Admin',
            ],
        ];

        // Crear usuarios y sus personas
        foreach ($usersData as $data) {
            $user = User::create([
                "name"     => $data['name'],
                "email"    => $data['email'],
                "password" => $data['password'],
            ]);

            // Crear la persona asociada al usuario
            Persona::create(array_merge($data['persona'], ['user_id' => $user->id]));
        }

        Driver::create([
            'persona_id' => 5,
            'license_number' => '9833345',
        ]);
    }
}
