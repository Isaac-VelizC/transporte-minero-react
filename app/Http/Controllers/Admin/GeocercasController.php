<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Geocerca\GeocercaCreateResquest;
use App\Http\Requests\Geocerca\GeocercaUpdateResquest;
use App\Models\Geocerca;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GeocercasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Geocerca::all();

        // Mapear los datos de los usuarios a la estructura deseada
        $geocercas = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'polygon_coordinates' => $item->polygon_coordinates,
                'type' => $item->type,
                'description' => $item->description,
                'is_active' => $item->is_active,
                'created_by' => $item->created_by,
                'email' => $item->creator->email
            ];
        });

        return Inertia::render('Admin/Map/Geocercas/index', [
            'geocercas' => $geocercas
        ]);
    }

    /**
     * Mostrar geocercas en el mapa
     */
    public function showMap()
    {
        $geocercas = Geocerca::where('is_active', true)->get();
        return Inertia::render('Admin/Map/index', [
            'geocercas' => $geocercas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Map/Geocercas/form', [
            'types' => [
                ['value' => 'zona_de_trabajo'],
                ['value' => 'zona_de_peligro'],
                ['value' => 'zona_de_descanso']
            ],
            'isEditing' => false
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(GeocercaCreateResquest $request)
    {

        $validatedData = $request->validated();

        $validatedData['created_by'] = Auth::id();

        try {
            Geocerca::create($validatedData);

            return redirect()
                ->route('geocerca.list')
                ->with('success', 'Geocerca creada exitosamente');
        } catch (\Exception $e) {
            Log::error('Error creating geocerca: ' . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'No se pudo crear la geocerca. Intente nuevamente.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);

            return Inertia::render('Admin/Map/Geocercas/form', [
                'geocerca' => $geocerca,
                'types' => [
                    ['value' => 'zona_de_trabajo'],
                    ['value' => 'zona_de_peligro'],
                    ['value' => 'zona_de_descanso']
                ],
                'isEditing' => true
            ]);
        } catch (ModelNotFoundException $e) {
            Log::warning("Intento de editar geocerca no existente: {$id}");

            return redirect()->back()->with('error', 'Geocerca no encontrada');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GeocercaUpdateResquest $request, string $id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);

            // Obtener los datos validados
            $validatedData = $request->validated();

            // Actualizar solo los campos que han cambiado
            $changes = collect($validatedData)
                ->filter(function ($value, $key) use ($geocerca) {
                    return $geocerca->{$key} !== $value;
                })
                ->toArray();

            // Si hay cambios, actualizar
            if (!empty($changes)) {
                $geocerca->fill($changes);

                // Si no se proporciona explícitamente, mantener el usuario original
                if (!isset($changes['created_by'])) {
                    $geocerca->created_by = $geocerca->created_by;
                }

                $geocerca->save();

                return redirect()
                    ->route('geocerca.list')
                    ->with('success', 'Geocerca actualizada exitosamente');
            }

            // Si no hay cambios, redirigir con un mensaje informativo
            return redirect()->back()->with('info', 'No se detectaron cambios en la geocerca');
        } catch (ModelNotFoundException $e) {
            return back()
                ->with('error', 'Geocerca no encontrada');
        } catch (\Exception $e) {
            Log::error('Error updating geocerca: ' . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'No se pudo actualizar la geocerca. Intente nuevamente.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $geocerca = Geocerca::findOrFail($id);

            // Alternar el estado de activación
            $geocerca->is_active = !$geocerca->is_active;
            $geocerca->save();

            // Mensaje dinámico basado en el nuevo estado
            $message = $geocerca->is_active
                ? 'Geocerca reactivada exitosamente'
                : 'Geocerca desactivada exitosamente';

            return redirect()->back()->with('success', $message);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Geocerca no encontrada');
        } catch (\Exception $e) {
            Log::error('Error al modificar estado de geocerca: ' . $e->getMessage());

            return redirect()->back()->with('error', 'No se pudo modificar el estado de la geocerca. Inténtalo nuevamente');
        }
    }
}
