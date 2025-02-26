<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleUpdateResquest extends FormRequest
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
            'matricula' => [
                'required',
                'string',
                'max:8',
                Rule::unique('vehicles', 'matricula')->ignore($this->route('id')),
            ],
            'mark_id' => ['required', 'exists:marks,id'],
            'type_id' => ['required', 'exists:type_vehicles,id'],
            'device_id' => 'nullable|exists:devices,id',
            'modelo' => 'required|string|max:50',
            'color' => 'required|string|max:30',
            'fecha_compra' => 'required|date',
            'status' => 'required|in:activo,mantenimiento,inactivo',
            'capacidad_carga' => 'nullable|integer|min:10|max:50',
            'kilometrage' => 'nullable|integer|min:100'
        ];
    }
}
