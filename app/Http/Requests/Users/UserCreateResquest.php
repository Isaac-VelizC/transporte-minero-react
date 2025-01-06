<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

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
                'min:7',
                'regex:/^\d{7,8}(?:-[0-9A-Z]{1,2})?$/',
                'unique:personas,ci'
            ],
            'genero' => [
                'required',
                'string',
                'in:Hombre,Mujer,Otro'
            ],
            'numero' => [
                'required',
                'string',
                'min:8',
                'max:10',
                'regex:/^\d+$/',
                'unique:personas,numero'
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:users,email'
            ],
            'license_number' => [
                'nullable',
                'string',
                'unique:drivers,license_number'
            ],
            'hiring_date' => [
                'nullable',
                'date_format:Y-m-d',
            ],
            'experiencia' => [
                'nullable',
                'integer',
                'min:1'
            ],
            'direccion' => [
                'nullable',
                'string',
            ]
        ];
    }
}
