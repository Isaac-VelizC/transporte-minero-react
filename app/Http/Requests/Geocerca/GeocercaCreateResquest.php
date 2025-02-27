<?php

namespace App\Http\Requests\Geocerca;

use Illuminate\Foundation\Http\FormRequest;

class GeocercaCreateResquest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;// auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:geocercas,name'
            ],
            'polygon_coordinates' => [
                'nullable',
                'json',
                function ($attribute, $value, $fail) {
                    // Opcional: Validación personalizada para estructura GeoJSON
                    if ($value !== null) {
                        $decoded = json_decode($value, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $fail('El formato de coordenadas no es un JSON válido');
                        }
                        // Puedes agregar más validaciones específicas de la estructura GeoJSON si lo deseas
                    }
                }
            ],
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90'
            ],
            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180'
            ],
            'radius' => [
                'nullable',
                'integer',
                'min:0'
            ],
            'type' => [
                'required',
                'in:zona_de_trabajo,zona_de_peligro,zona_de_descanso,Zonas_de_mantenimiento,Zonas_de_seguridad_y_emergencia'
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'created_by' => [
                'exists:users,id'
            ],
            'color' => [
                'required',
                'string',
            ],
            'is_active' => [
                'required',
                'boolean'
            ]
        ];
    }
}
