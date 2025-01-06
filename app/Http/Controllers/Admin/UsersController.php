<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserCreateResquest;
use App\Http\Requests\Users\UserUpdateResquest;
use App\Models\CargoShipment;
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
    public function listClients() {
        $list = Persona::where('rol', 'cliente')->with('user')->get();
        return Inertia::render('Admin/Users/Clients/index', [
            'clientes' => $list,
        ]);
    }

    public function listConductores() {
        $list = Persona::where('rol', 'conductor')->with('user', 'driver')->get();
        return Inertia::render('Admin/Users/Conductor/index', [
            'drivers' => $list,
        ]);
    }

    public function index() {
        $users = Persona::with('user')->where('rol', '!=', 'Admin')->get();
        $roles = Role::whereNotIn('name', ['Admin', 'Conductor', 'Cliente'])->get();
        return Inertia::render('Admin/Users/index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function storeCliente(UserCreateResquest $request) {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['ci'],
                    'password' => Hash::make('TM.' . $data['ci']),
                ]
            );
            $user->syncRoles(['Cliente']);
            // Create or update persona
            Persona::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($data, [
                    'rol' => 'cliente',
                    'user_id' => $user->id
                ])
            );

            DB::commit();

            return redirect()->route('clients.list')
                ->with('success', "Cliente {$user->name} registrado exitosamente.");
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error('User creation error: ' . $exception->getMessage());
            return redirect()->route('clients.list')
                ->with('error', 'No se pudo registrar al cliente. ' . $exception->getMessage());
        }
    }

    public function updateCliente(UserUpdateResquest $request, $id) {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = User::with('persona')->findOrFail($id);
            $user->update(['email' => $data['email']]);
            $user->persona->update($data);
            DB::commit();
            return redirect()->route('clients.list')
                ->with('success', "Cliente {$user->name} actualizado exitosamente.");
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return redirect()->route('clients.list')->with('error', 'Cliente no encontrado.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar el usuario: ' . $e->getMessage());
            return redirect()->route('clients.list')->with('error', 'No se pudo actualizar el Cliente. ' . $e->getMessage());
        }
    }

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

    public function update(UserUpdateResquest $request, $id)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = User::with('persona')->findOrFail($id);
            $user->fill([
                'email' => $data['email']
            ])->save();
            $user->syncRoles([$request->rol]);
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
            Log::error('User update error: ' . $e->getMessage());
            return redirect()
                ->route('user.list')
                ->with('error', 'No se pudo actualizar el usuario. ' . $e->getMessage());
        }
    }

    public function destroy(string $id) {
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

    public function historialEnviosCliente($id)
    {
        try {
            $persona = Persona::findOrFail($id);
            $envios = CargoShipment::where('client_id', $id)->get();
            return Inertia::render('Admin/Users/Clients/historyList', [
                'cliente' => $persona,
                'envios' => $envios
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Persona not found: ', ['id' => $id, 'error' => $e]);
            return redirect()->back()->with('error', 'Cliente no encontrado.');
        } catch (\Exception $e) {
            Log::error('Error retrieving client data: ', ['error' => $e]);
            return redirect()->back()->with('error', 'Ocurrió un error al obtener los datos.');
        }
    }

    public function reestablecerPasswordUser($id) {
        try {
            $user = Persona::findOrFail($id)->user;
            $newPassword = 'TM.' . $user->persona->ci;
            $user->update([
                'password' => Hash::make($newPassword),
            ]);
            return redirect()->back()->with(
                'success',
                "Contraseña reestablecida correctamente a: $newPassword"
            );
        } catch (\Exception $e) {
            return redirect()->back()->with(
                'error',
                'No se pudo reestablecer la contraseña.'
            );
        }
    }
}
