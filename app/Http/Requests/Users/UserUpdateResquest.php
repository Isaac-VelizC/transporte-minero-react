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
                'size:7',
                'regex:/^\d{7}[A-Za-z]*$/',
                Rule::unique('personas', 'ci')->ignore($this->route('id')), // Ignora el ID actual
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
                'regex:/^\d+$/',
                Rule::unique('personas', 'numero')->ignore($this->route('id')), // Ignora el ID actual
            ],
            'rol' => [
                'required',
                'string',
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->route('id')),
            ],
        ];
    }
}
