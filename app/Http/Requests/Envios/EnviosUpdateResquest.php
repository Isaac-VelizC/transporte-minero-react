<?php

namespace App\Http\Requests\Envios;

use Illuminate\Foundation\Http\FormRequest;

class EnviosUpdateResquest extends FormRequest
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
            'car_id' => 'nullable|exists:vehicles,id', // Debe existir en la tabla vehicles
            'programming' => 'required|exists:vehicle_schedules,id', // Debe existir en la tabla vehicle_schedules
            'client_id' => 'required|exists:personas,id', // Debe existir en la tabla personas
            'conductor_id' => 'nullable|exists:personas,id', // Debe existir en la tabla personas
            'geofence_id' => 'required|exists:geocercas,id', // Debe existir en la tabla personas
            'peso' => 'required|numeric|min:0', // Peso requerido y debe ser un número positivo
            'origen' => 'required|string|max:255', // Destino requerido y no puede exceder 255 caracteres
            'destino' => 'required|string|max:255', // Destino requerido y no puede exceder 255 caracteres
            'fecha_envio' => 'required|date|after_or_equal:today',
            'fecha_entrega' => 'required|date|after:fecha_envio', 
            'notas' => 'nullable|string|max:500',
            'client_latitude' => 'required|numeric',
            'client_longitude' => 'required|numeric',
            'origen_latitude' => 'required|numeric',
            'origen_longitude' => 'required|numeric',
            'sub_total' => 'nullable|numeric|min:0'
        ];
    }

    public function messages()
    {
        return [
            'car_id.exists' => 'El vehículo seleccionado no existe.',
            'programming.exists' => 'La programación seleccionada no existe.',
            'client_id.exists' => 'El cliente seleccionado no existe.',
            'peso.required' => 'El peso es obligatorio.',
            'peso.numeric' => 'El peso debe ser un número.',
            'peso.min' => 'El peso debe ser al menos 0.',
            'destino.required' => 'El destino es obligatorio.',
            'destino.string' => 'El destino debe ser una cadena de texto.',
            'destino.max' => 'El destino no puede exceder 255 caracteres.',
            'fecha_entrega.date' => 'La fecha de entrega debe ser una fecha válida.',
            'fecha_entrega.after_or_equal' => 'La fecha de entrega debe ser igual o posterior a la fecha de hoy.',
            'notas.string' => 'Las notas deben ser una cadena de texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ];
    }
}
