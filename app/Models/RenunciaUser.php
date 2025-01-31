<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RenunciaUser extends Model
{
    protected $table = 'renuncia_users';
    protected $fillable = [
        'message',
        'vehicle',
        'envio',
        'fecha',
        'persona_id',
        'schedule_id'
    ];

    public function conductor()
    {
        return $this->belongsTo(Persona::class, 'persona_id');
    }

    public function schedule() {
        return $this->belongsTo(VehicleSchedule::class, 'schedule_id');
    }
}
