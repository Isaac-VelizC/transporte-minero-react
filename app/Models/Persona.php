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

    public function renuncia() {
        return $this->hasMany(RenunciaUser::class, 'persona_id');
    }

    public function driver()
    {
        return $this->hasOne(Driver::class, 'persona_id');
    }

    public function envios()
    {
        return $this->hasMany(CargoShipment::class, 'conductor_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'responsable_id');
    }

    public function messages() {
        return $this->hasMany(Message::class, 'client_id');
    }
}
