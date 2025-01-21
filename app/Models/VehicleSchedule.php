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

    public function cargoShipments()
    {
        return $this->belongsToMany(CargoShipment::class, 'cargo_shipment_vehicle_schedule', 'vehicle_schedule_id', 'cargo_shipment_id');
    }
}
