<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserCreateResquest;
use App\Http\Requests\Users\UserUpdateResquest;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    public function formatFullName(): string
    {
        return trim(
            ($this->persona->nombre ?? '') . ' ' .
                ($this->persona->ap_pat ?? '') . ' ' .
                ($this->persona->ap_mat ?? '')
        );
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['persona', 'roles'])
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'Admin');
            })
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->persona->id,
                    'user_id' => $user->id,
                    'full_name' => $user->persona ?
                        trim("{$user->persona->nombre} {$user->persona->ap_pat} {$user->persona->ap_mat}") :
                        '',
                    'nombre' => optional($user->persona)->nombre ?? '',
                    'ap_pat' => optional($user->persona)->ap_pat ?? '',
                    'ap_mat' => optional($user->persona)->ap_mat ?? '',
                    'ci' => optional($user->persona)->ci ?? '',
                    'email' => $user->email ?? '',
                    'genero' => optional($user->persona)->genero ?? '',
                    'numero' => optional($user->persona)->numero ?? '',
                    'estado' => optional($user->persona)->estado ?? '',
                    'rol' => optional($user->persona)->rol ?? '',
                ];
            });

        $roles = Role::whereNotIn('name', ['Admin', 'Conductor', 'Secretaria'])->get();

        return Inertia::render('Admin/Users/index', compact('users', 'roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateResquest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Validate role existence more efficiently
            $role = Role::where('name', $request->rol)->first();
            if (!$role) {
                throw new \InvalidArgumentException('El rol especificado no existe.');
            }

            // Create user with a more robust approach
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['ci'],
                    'password' => Hash::make('TM.' . $data['ci']),
                ]
            );
            // Sync roles instead of assign (more reliable)
            $user->syncRoles([$request->rol]);
            // Create or update persona
            Persona::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($data, [
                    'rol' => $request->rol,
                    'user_id' => $user->id
                ])
            );

            DB::commit();

            // Use a more specific success message
            return redirect()->route('user.list')
                ->with('success', "Usuario {$user->name} registrado exitosamente.");
        } catch (\Exception $exception) {
            DB::rollBack();
            // Log the actual error for debugging
            Log::error('User creation error: ' . $exception->getMessage());
            return redirect()->route('user.list')
                ->with('error', 'No se pudo registrar el usuario. ' . $exception->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            dd('No tiene Funcioanlaidad ' . $id);
        } catch (ModelNotFoundException $e) {
            // Manejo de error si no se encuentra el modelo
            return redirect()->route('users.index')->with('error', 'Usuario no encontrado.');
        } catch (\Exception $e) {
            // Manejo de otros errores
            return redirect()->route('users.index')->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateResquest $request, $id)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = User::with('persona')->findOrFail($id);
            // Update user details
            $user->fill([
                'email' => $data['email']
            ])->save();
            // Sync user roles
            $user->syncRoles([$request->rol]);
            // Update persona details
            $user->persona->fill($data + ['rol' => $request->rol])->save();
            DB::commit();

            return redirect()
                ->route('user.list')
                ->with('success', "Usuario {$user->name} actualizado exitosamente.");
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()
                ->route('user.list')
                ->with('error', 'Usuario o rol no encontrado.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the actual error for debugging
            Log::error('User update error: ' . $e->getMessage());

            return redirect()
                ->route('user.list')
                ->with('error', 'No se pudo actualizar el usuario. ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::with('persona')->findOrFail($id);

            if (!$user->persona) {
                return redirect()->back()->with('error', 'La relación persona no existe para este usuario.');
            }
            // Alternar el estado usando toggle o negación
            $user->persona->estado = !$user->persona->estado;
            $user->persona->save();
            // Mensaje dinámico basado en el nuevo estado
            $message = $user->persona->estado
                ? 'Usuario reactivado correctamente'
                : 'Usuario desactivado correctamente';

            return redirect()->back()->with('success', $message);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Usuario no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado del usuario: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al modificar el estado del usuario.');
        }
    }
}
