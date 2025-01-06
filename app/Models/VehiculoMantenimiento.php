<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehiculoMantenimiento extends Model
{
    use HasFactory;

    protected $table = 'vehiculo_mantenimientos';

    protected $fillable = [
        'vehicle_id',
        'fecha_inicio',
        'fecha_fin',
        'observaciones',
        'estado',
        'tipo'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function tipo()
    {
        return $this->belongsTo(TipoMantenimiento::class, 'tipo');
    }
}
