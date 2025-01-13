<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RutaDevice extends Model
{
    protected $table = 'ruta_devices';

    protected $fillable = [
        'envio_id',
        'device_id',
        'coordenadas',
        'color',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}
