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
            'matricula' => 'required|string|min:6|max:8|unique:vehicles,matricula|regex:/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/',
            'mark_id' => 'required|exists:marks,id',
            'device_id' => 'nullable|exists:devices,id',
            'color' => 'required|string|max:15',
            'modelo' => 'required|string|max:50',
            'type_id' => 'required|exists:type_vehicles,id',
            'fecha_compra' => 'required|date',
            'status' => 'required|in:activo,mantenimiento,inactivo',
            'capacidad_carga' => 'nullable|integer|min:20|max:600',
            'kilometrage' => 'nullable|integer|min:1'
        ];
    }


    public function messages(): array
    {
        return [
            'matricula.regex' => 'La matrícula debe contener al menos una letra y un número.',
        ];
    }
}
