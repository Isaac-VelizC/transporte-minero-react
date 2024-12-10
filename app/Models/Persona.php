<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $table = 'personas';

    protected $fillable = [
        'user_id',
        'nombre',
        'ap_pat',
        'ap_mat',
        'ci',
        'genero',
        'numero',
        'estado',
        'rol'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'user_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'responsable_id');
    }
}
