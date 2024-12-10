<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserCreateResquest extends FormRequest
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
            'nombre' => [
                'required',
                'string',
                'max:100',
                'regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+$/'
            ],
            'ap_pat' => [
                'required',
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
                'size:7', // Para asegurar que tenga al menos 7 caracteres y un carácter adicional
                'regex:/^\d{7}[A-Za-z]*$/', // Los primeros 7 caracteres deben ser números, luego letras opcionales
                'unique:personas,ci'
            ],
            'genero' => [
                'required',
                'string',
                'in:Hombre,Mujer,Otro' // Asegura que el género sea uno de los valores permitidos
            ],
            'numero' => [
                'required',
                'string',
                'min:8',
                'regex:/^\d+$/', // Solo números
                'unique:personas,numero'
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
