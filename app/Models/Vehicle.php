<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'vehicles';

    protected $fillable = [
        'matricula',
        'mark_id',
        'type_id',
        'device_id',
        'modelo',
        'color',
        'fecha_compra',
        'status',
        'kilometrage',
        'responsable_id',
        'capacidad_carga',
    ];

    public function marca() {
        return $this->belongsTo(Mark::class, 'mark_id');
    }
    
    public function tipo() {
        return $this->belongsTo(TypeVehicle::class, 'type_id');
    }

    public function cargoShipments()
    {
        return $this->hasMany(CargoShipment::class, 'car_id');
    }

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function schedules()
    {
        return $this->hasMany(VehicleSchedule::class, 'car_id');
    }

    public function mantenimientos() {
        return $this->hasMany(VehiculoMantenimiento::class, 'vehicle_id');
    }
}