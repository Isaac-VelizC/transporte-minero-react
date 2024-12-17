<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserCreateResquest;
use App\Http\Requests\Users\UserUpdateResquest;
use App\Models\Driver;
use App\Models\Persona;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ConductorController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Users/drivers', [
            'isEditing' => false
        ]);
    }

    public function store(UserCreateResquest $request)
    {
        $data = $request->validated();

        // Usar una transacción para asegurar la integridad de los datos
        DB::transaction(function () use ($data, $request) {
            // Crear o actualizar el usuario, asegurando que la contraseña sea segura
            $user = User::updateOrCreate(
                ['email' => $data['email']], // Busca por email
                [
                    'name' => $data['ci'], // Usar CI como nombre (si es apropiado)
                    'password' => Hash::make('TM.' . $data['ci']), // Generación segura de la contraseña
                ]
            );

            // Asignar el rol 'Conductor' solo si no lo tiene
            if (!$user->hasRole('Conductor')) {
                $user->assignRole('Conductor');
            }

            // Crear la persona asociada, solo si no existe
            $persona = Persona::updateOrCreate(
                ['user_id' => $user->id], // Asegurarse de que la persona esté asociada al usuario
                array_merge($data, [
                    'rol' => 'Conductor', // Asignar rol directamente al crear la persona
                ])
            );

            // Crear el conductor solo si no existe
            Driver::updateOrCreate(
                ['persona_id' => $persona->id], // Relacionar con la persona
                [
                    'license_number' => $data['license_number'],
                    'hiring_date' => Carbon::parse($data['hiring_date']), // Asegurarse de que la fecha sea válida
                ]
            );
        });

        // Retornar un mensaje de éxito más descriptivo
        return redirect()->route('user.list')
            ->with('success', 'El conductor ha sido registrado y asignado correctamente.');
    }

    public function edit($id)
    {
        $item = User::with(['persona'])->findOrFail($id);
        $driver = [
            'id' => $item->persona->id,
            'user_id' => $item->id,
            'driver_id' => $item->persona->driver->id,
            'nombre' => $item->persona->nombre,
            'ap_pat' => $item->persona->ap_pat,
            'ap_mat' => $item->persona->ap_mat,
            'email' => $item->email,
            'ci' => $item->persona->ci,
            'genero' => $item->persona->genero,
            'numero' => $item->persona->numero,
            'license_number' => $item->persona->driver->license_number ?? null,
            'hiring_date' => $item->persona->driver->hiring_date ?? null,
        ];
        return Inertia::render('Admin/Users/drivers', [
            'driver' => $driver,
            'isEditing' => true,
        ]);
    }

    public function update(UserUpdateResquest $request, $id)
    {
        try {
            $data = $request->validated();
            $user = User::findOrFail($id);
            $persona = Persona::where('user_id', $id)->firstOrFail();

            // Actualizar el usuario
            $user->update([
                'email' => $data['email'],
            ]);

            // Actualizar los datos de la persona
            $persona->update($data);

            // Crear el conductor solo si no existe
            Driver::updateOrCreate(
                ['persona_id' => $persona->id],
                [
                    'license_number' => $data['license_number'],
                    'hiring_date' => Carbon::parse($data['hiring_date']),
                ]
            );

            // Retornar un mensaje de éxito
            return redirect()->route('user.list')->with('success', 'Persona actualizada con éxito.');
        } catch (ModelNotFoundException $e) {
            // Si no se encuentra el usuario o la persona
            return redirect()->route('user.list')->with('error', 'Persona no encontrada.');
        } catch (\Throwable $th) {
            // Si ocurre cualquier otro error
            return redirect()->route('user.list')->with('error', 'No se pudo actualizar la persona. Inténtalo nuevamente.');
        }
    }

}
