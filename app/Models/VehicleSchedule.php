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
        'route',
        'driver_id',
        'status',
        'notes'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id'); // Asegúrate de que el modelo Driver exista
    }
}
