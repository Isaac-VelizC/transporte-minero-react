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
            'license_number' => [
                'nullable',
                'string',
                Rule::unique('drivers', 'license_number')->ignore($this->route('id_driver')),
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
