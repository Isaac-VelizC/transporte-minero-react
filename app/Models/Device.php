<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $table = 'devices';

    protected $fillable = [
        'num_serial',
        'name_device',
        'visorID',
        'type',
        'status',
        'last_latitude',
        'last_longitude',
        'last_updated_at'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'device_id');
    }

    public function rutas()
    {
        return $this->hasMany(RutaDevice::class, 'device_id');
    }
}
