<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Crear roles
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Secretario/a']);
        Role::create(['name' => 'Encargado de control']);
        Role::create(['name' => 'Cliente']);
        Role::create(['name' => 'Conductor']);

        // Crear permisos
        Permission::create(['name' => 'GestionUsers']);
        Permission::create(['name' => 'GestionVehiculos']);
        Permission::create(['name' => 'GestionEnvios']);
        Permission::create(['name' => 'Reportes']);
        Permission::create(['name' => 'GestionGeocercas']);
        Permission::create(['name' => 'ProgramacionVehiculo']);
        Permission::create(['name' => 'Monitoreo']);

        // Asignar permisos a roles
        $adminRole = Role::findByName('Admin');
        $adminRole->givePermissionTo([
            'GestionUsers',
            'GestionVehiculos',
            'GestionEnvios',
            'Reportes',
            'GestionGeocercas',
            'ProgramacionVehiculo',
            'Monitoreo'
        ]);
        $secretaryRole = Role::findByName('Secretario/a');
        $secretaryRole->givePermissionTo([
            'GestionUsers',
            'GestionVehiculos',
            'GestionEnvios',
            'Reportes',
        ]);
        // Asignar roles a usuarios
        $userAdmin = User::find(1);
        $userAdmin->assignRole('Admin');
        $userSecretary = User::find(2);
        $userSecretary->assignRole('Secretario/a');
        $userSecretary = User::find(3);
        $userSecretary->assignRole('Encargado de control');
        $userSecretary = User::find(4);
        $userSecretary->assignRole('Cliente');
        $userSecretary = User::find(5);
        $userSecretary->assignRole('Conductor');
    }
}
