<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RutaPunto extends Model
{
    protected $table = 'ruta_puntos';

    protected $fillable = [
        'ruta_id',
        'latitude',
        'longitude',
        'created_at',
    ];

    public function rutaDevice()
    {
        return $this->belongsTo(RutaDevice::class, 'ruta_id');
    }
}
