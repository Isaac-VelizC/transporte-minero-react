<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehicleCreateResquest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'matricula' => 'required|string|max:10|unique:vehicles,matricula',
            'mark_id' => 'required|exists:marks,id',
            'color' => 'required|string|max:15',
            'modelo' => 'required|string|max:50',
            'type_id' => 'required|exists:type_vehicles,id',
            'fecha_compra' => 'required|date',
            'status' => 'required|in:activo,mantenimiento,inactivo',
            'capacidad_carga' => 'nullable|integer|min:0',
        ];
    }
}
