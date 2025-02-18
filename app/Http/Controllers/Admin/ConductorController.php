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
        return Inertia::render('Admin/Users/Conductor/drivers', [
            'isEditing' => false
        ]);
    }

    public function store(UserCreateResquest $request)
    {
        if ($request->ap_pat === null && $request->ap_mat === null ) {
            return back()->with('error', 'Debe registrar por lo menos un apellido');
        }
        $data = $request->validated();
        DB::transaction(function () use ($data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['ci'],
                    'password' => Hash::make('TM.' . $data['ci']),
                ]
            );
            if (!$user->hasRole('Conductor')) {
                $user->assignRole('Conductor');
            }
            $persona = Persona::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($data, [
                    'rol' => 'Conductor',
                ])
            );
            // Crear el conductor solo si no existe
            Driver::updateOrCreate(
                ['persona_id' => $persona->id], // Relacionar con la persona
                [
                    'hiring_date' => Carbon::parse($data['hiring_date']),
                    'experiencia' => $data['experiencia'],
                    'direccion' => $data['direccion']
                ]
            );
        });
        // Retornar un mensaje de éxito más descriptivo
        return redirect()->route('drivers.list')
            ->with('success', 'El conductor ha sido registrado y asignado correctamente.');
    }

    public function edit($id)
    {
        
        $item = Persona::where('user_id', $id)->with('user', 'driver')->first();
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
            'hiring_date' => $item->persona->driver->hiring_date ?? null,
            'direccion' => $item->persona->driver->direccion ?? null,
            'experiencia' => $item->persona->driver->experiencia ?? null,
        ];
        return Inertia::render('Admin/Users/Conductor/drivers', [
            'driver' => $driver,
            'isEditing' => true,
        ]);
    }

    public function update(UserUpdateResquest $request, $id)
    {
        if ($request->ap_pat === null && $request->ap_mat === null ) {
            return back()->with('error', 'Debe registrar por lo menos un apellido');
        }

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
                    'hiring_date' => Carbon::parse($data['hiring_date']),
                    'experiencia' => $data['experiencia'],
                    'direccion' => $data['direccion']
                ]
            );
            // Retornar un mensaje de éxito
            return redirect()->route('drivers.list')->with('success', 'Persona actualizada con éxito.');
        } catch (ModelNotFoundException $e) {
            // Si no se encuentra el usuario o la persona
            return redirect()->back()->with('error', 'Persona no encontrada.');
        } catch (\Throwable $th) {
            // Si ocurre cualquier otro error
            return redirect()->back()->with('error', 'No se pudo actualizar la información. Inténtalo nuevamente.');
        }
    }
}
