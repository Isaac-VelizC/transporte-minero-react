<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserCreateResquest;
use App\Http\Requests\Users\UserUpdateResquest;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

use function PHPSTORM_META\map;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        // Obtener todos los usuarios que no tienen el rol 'Admin'
        $items = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'Admin');
        })->get();

        // Mapear los datos de los usuarios a la estructura deseada
        $users = $items->map(function ($item) {
            return [
                'user_id' => $item->id,
                'nombre' => $item->persona->nombre ?? '', // Asegúrate de tener la relación definida
                'ap_pat' => $item->persona->ap_pat ?? '',
                'ap_mat' => $item->persona->ap_mat ?? '',
                'ci' => $item->persona->ci ?? '',
                'email' => $item->email ?? '',
                'genero' => $item->persona->genero ?? '',
                'numero' => $item->persona->numero ?? '',
                'avatar' => $item->persona->avatar ?? '',
                'estado' => $item->persona->estado ?? '',
                'rol' => $item->persona->rol ?? '',
            ];
        });
        $roles = Role::where('name', '!=', 'Admin')->get();

        // Retornar la vista utilizando Inertia
        return Inertia::render('Admin/Users/index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateResquest $request)
    {
        try {
            // Iniciar una transacción
            DB::beginTransaction();

            // Validar los datos
            $data = $request->validated();

            // Crear o buscar el usuario
            $user = User::firstOrCreate(
                ['email' => $data['email']], // Condición para buscar
                [
                    'name' => $data['ci'], // Datos para crear
                    'password' => Hash::make('TM.' . $data['ci']),
                ]
            );

            // Verificar y asignar el rol
            if (!Role::where('name', $request->rol)->exists()) {
                throw new \Exception('El rol especificado no existe.');
            }
            $user->assignRole($request->rol);

            // Crear la persona y asociarla al usuario
            $persona = new Persona($data);
            $persona->user_id = $user->id; // Relacionar con el usuario
            $persona->save();

            // Confirmar la transacción
            DB::commit();

            // Retornar respuesta exitosa
            return redirect()->route('user.list')->with('success', 'Persona registrada con éxito.');
        } catch (\Throwable $th) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            // Manejar excepciones y retornar un error
            return redirect()->route('user.list')->with('error', 'No se pudo registrar la persona. Inténtalo nuevamente.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Verificar si el usuario tiene permiso para ver la información
        /*if (!Auth::user()->can('view persona')) {
            abort(403, 'No tienes permiso para acceder a esta página.');
        }*/

        try {
            // Obtener la persona con Eager Loading para evitar N+1
            $item = Persona::with('user')->findOrFail($id); // Esto lanzará una excepción si no se encuentra

            // Mapear los datos de la persona a la estructura deseada
            $user = [
                'user_id' => $item->id,
                'nombre' => $item->nombre ?? '',
                'ap_pat' => $item->ap_pat ?? '',
                'ap_mat' => $item->ap_mat ?? '',
                'ci' => $item->ci ?? '',
                'email' => $item->user->email ?? '', // Asegúrate de que la relación esté definida
                'genero' => $item->genero ?? '',
                'numero' => $item->numero ?? '',
                'avatar' => $item->avatar ?? '',
                'estado' => $item->estado ?? '',
                'rol' => $item->rol ?? '',
            ];

            // Retornar la vista utilizando Inertia
            return Inertia::render('Admin/Users/show', [
                'user' => $user,
            ]);
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
        try {
            // Iniciar una transacción
            DB::beginTransaction();

            // Obtener los datos validados
            $data = $request->validated();
            // Buscar la instancia de Persona
            $persona = Persona::where('user_id', $id)->firstOrFail();
            // Buscar la instancia de User asociada
            $user = User::findOrFail($id);
            $user->email = $data['email'];
            $user->update();

            // Verificar si el nuevo rol existe
            $role = Role::where('name', $request->rol)->first();
            if (!$role) {
                return redirect()->route('user.list')->with('error', 'El rol especificado no existe.');
            }

            // Actualizar el rol del usuario
            $user->syncRoles([$request->rol]);

            // Actualizar datos del modelo Persona
            $persona->update($data);

            // Confirmar la transacción
            DB::commit();

            // Retornar una respuesta exitosa
            return redirect()->route('user.list')->with('success', 'Persona actualizada con éxito.');
        } catch (ModelNotFoundException $e) {
            // Manejar el caso de que no se encuentre la persona
            DB::rollBack();
            
            return redirect()->route('user.list')->with('error', 'Persona no encontrado.');
        } catch (\Throwable $th) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            return redirect()->route('user.list')->with('error', 'No se pudo actualizar la persona. Inténtalo nuevamente.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Intentar encontrar el usuario por ID
            $user = User::findOrFail($id); // Esto lanzará una excepción si no se encuentra
            if ($user->persona) {
                // Cambiar el estado de la relación `persona`
                $user->persona->estado = !$user->persona->estado; // Alterna entre true y false
                $user->persona->save(); // Guardar los cambios en la relación `persona`
            } else {
                // Manejar el caso en que `persona` no exista
                return redirect()->back()->with('error', 'La relación persona no existe para este usuario.');
            }
            // Opcional: Puedes eliminar el usuario si es necesario
            // $user->delete();

            // Retornar a la vista o redirigir con un mensaje de éxito
            return redirect()->back()->with('success', 'Usuario desactivado correctamente.');
        } catch (ModelNotFoundException $e) {
            // Manejar el caso en que no se encuentra el usuario
            return redirect()->back()->with('error', 'Usuario no encontrado.');
        } catch (\Exception $e) {
            // Manejo de otros errores
            return redirect()->back()->with('error', 'Ocurrió un error al desactivar el usuario.');
        }
    }
}
