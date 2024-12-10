<?php

namespace Database\Seeders;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                    'rol' => 'A'
                ],
                'role' => 'Admin',
            ],
            [
                'name' => 'Teagan Croft',
                'email' => 'teagan.croft@gmail.com',
                'password' => bcrypt('TeaganCroft'),
                'persona' => [
                    'nombre' => 'Teagan',
                    'ap_pat' => 'Croft',
                    'ci' => '9828472',
                    'genero' => 'Mujer',
                    'rol' => 'S'
                ],
                'role' => 'Secretario/a',
            ],
            [
                'name' => 'Rachel Starr',
                'email' => 'rachel.starr@gmail.com',
                'password' => bcrypt('RachelStarr'),
                'persona' => [
                    'nombre' => 'Rachel',
                    'ap_pat' => 'Starr',
                    'ci' => '9813742',
                    'genero' => 'Mujer',
                    'rol' => 'E'
                ],
                'role' => 'Encargado de control',
            ],
            [
                'name' => 'Peyton List',
                'email' => 'peyton.list@gmail.com',
                'password' => bcrypt('PeytonList'),
                'persona' => [
                    'nombre' => 'Peyton',
                    'ap_pat' => 'List',
                    'ci' => '2938343',
                    'genero' => 'Mujer',
                    'rol' => 'C'
                ],
                'role' => 'Cliente',
            ],
            [
                'name' => 'Sandara Park',
                'email' => 'sandara.park@gmail.com',
                'password' => bcrypt('SandaraPark'),
                'persona' => [
                    'nombre' => 'Sandara',
                    'ap_pat' => 'Park',
                    'ci' => '2843921',
                    'genero' => 'Mujer',
                    'rol' => 'D'
                ],
                // Asignar rol directamente en el array
            ]
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
    }
}
