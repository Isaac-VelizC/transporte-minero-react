<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateResquest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    /*public function authorize(): bool
    {
        return false;
    }*/

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:100',
                'regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+$/'
            ],
            'ap_pat' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+$/'
            ],
            'ap_mat' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]*$/'
            ],
            'ci' => [
                'required',
                'string',
                'min:7',
                'regex:/^\d{7,8}(?:-[0-9A-Z]{1,2})?$/',
                Rule::unique('personas', 'ci')->ignore($this->route('id_persona')),
            ],
            'genero' => [
                'required',
                'string',
                'in:Hombre,Mujer,Otro'
            ],
            'numero' => [
                'required',
                'string',
                'size:8',
                'regex:/^\d+$/',
                Rule::unique('personas', 'numero')->ignore($this->route('id_persona')),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->route('id')),
            ],
            'hiring_date' => [
                'nullable',
                'date_format:Y-m-d',
            ],
            'experiencia' => [
                'nullable',
                'integer',
                'min:1',
                'max:50'
            ],
            'direccion' => [
                'nullable',
                'string',
            ]
        ];
    }

    public function messages(): array
    {
        return [
            // Mensajes para el campo nombre
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser una cadena de texto.',
            'nombre.regex' => 'El nombre solo puede contener letras y espacios.',

            // Mensajes para el campo ap_pat (apellido paterno)
            'ap_pat.required' => 'El apellido paterno es obligatorio.',
            'ap_pat.string' => 'El apellido paterno debe ser una cadena de texto.',
            'ap_pat.regex' => 'El apellido paterno solo puede contener letras y espacios.',

            // Mensajes para el campo ap_mat (apellido materno)
            'ap_mat.string' => 'El apellido materno debe ser una cadena de texto.',
            'ap_mat.regex' => 'El apellido materno solo puede contener letras y espacios.',

            // Mensajes para el campo ci (cédula de identidad)
            'ci.required' => 'La cédula de identidad es obligatoria.',
            'ci.string' => 'La cédula de identidad debe ser una cadena de texto.',
            'ci.min' => 'La cédula de identidad debe tener al menos 7 caracteres.',
            'ci.regex' => "La cédula de identidad debe tener entre 7 y 8 dígitos y puede incluir un guion seguido de letras.",
            'ci.unique' => "La cédula de identidad ya está registrada.",

            // Mensajes para el campo genero
            'genero.required' => "El género es obligatorio.",
            'genero.string' => "El género debe ser una cadena de texto.",
            'genero.in' => "El género debe ser uno de los siguientes: Hombre, Mujer, Otro.",

            // Mensajes para el campo numero
            'numero.required' => 'El número es obligatorio.',
            'numero.number' => 'El número no debe ser una cadena de texto.',
            'numero.min' => 'El número debe tener al menos 8 caracteres.',
            'numero.max' => 'El número no puede exceder 10 caracteres.',
            'numero.regex' => "El número solo puede contener dígitos.",
            'numero.unique' => "El número ya está registrado.",

            // Mensajes para el campo email
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.string' => 'El correo electrónico debe ser una cadena de texto.',
            'email.lowercase' => "El correo electrónico debe estar en minúsculas.",
            'email.email' => "Debe proporcionar un correo electrónico válido.",
            'email.max' => "El correo electrónico no puede exceder 255 caracteres.",
            'email.unique' => "El correo electrónico ya está registrado.",
            // Mensajes para el campo hiring_date
            'hiring_date.date_format' => "La fecha de contratación debe estar en formato Y-m-d.",
            // Mensajes para el campo experiencia
            'experiencia.integer' => "La experiencia debe ser un número entero.",
            'experiencia.min' => "La experiencia debe ser al menos 1 año.",
            'experiencia.max' => "La experiencia no puede exceder 50 años.",
            // Mensajes para el campo direccion
            'direccion.string' => "La dirección debe ser una cadena de texto.",
        ];
    }
}
