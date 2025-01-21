<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $table = 'drivers';

    protected $fillable = [
        'persona_id',
        'hiring_date',
        'status',
        'experiencia',
        'direccion'
    ];

    public function formatFullName(): string
    {
        return trim(
            ($this->persona->nombre ?? '') . ' ' .
                ($this->persona->ap_pat ?? '') . ' ' .
                ($this->persona->ap_mat ?? '')
        );
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id');
    }

    public function envios()
    {
        return $this->hasMany(VehicleSchedule::class, 'driver_id');
    }

    public function altercadosReports() {
        return $this->hasMany(AltercationReport::class, 'driver_id');
    }

}
