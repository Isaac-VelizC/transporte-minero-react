<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CargoShipmentVehicleSchedule extends Model
{
    use HasFactory;

    protected $table = 'cargo_shipment_vehicle_schedule';

    protected $fillable = [
        'cargo_shipment_id',
        'vehicle_schedule_id',
        'car_id', // Opcional, dependiendo de si necesitas acceder directamente al vehículo
        'conductor_id' // Opcional, dependiendo de si necesitas acceder directamente al conductor
    ];

    // Relación con CargoShipment
    public function cargoShipment()
    {
        return $this->belongsTo(CargoShipment::class, 'cargo_shipment_id');
    }

    // Relación con VehicleSchedule
    public function vehicleSchedule()
    {
        return $this->belongsTo(VehicleSchedule::class, 'vehicle_schedule_id');
    }

    // Relación con Vehicle (opcional)
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }

    // Relación con Persona (conductor) (opcional)
    public function conductor()
    {
        return $this->belongsTo(Persona::class, 'conductor_id');
    }

}
