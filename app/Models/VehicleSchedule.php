<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleSchedule extends Model
{
    use HasFactory;

    protected $table = 'vehicle_schedules';

    protected $fillable = [
        'car_id',
        'start_time',
        'end_time',
        'driver_id',
        'status',
        'status_time'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function cargas()
    {
        return $this->hasMany(CargoShipment::class, 'programming');
    }
}
