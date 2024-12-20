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
        'type',
        'car_id',
        'status',
        'last_latitude',
        'last_longitude',
        'last_updated_at',
        'update_interval'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }
}
