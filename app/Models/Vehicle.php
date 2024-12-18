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
        'modelo',
        'color',
        'fecha_compra',
        'status',
        'responsable_id',
        'capacidad_carga',
        'fecha_ultima_revision'
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

    public function reports()
    {
        return $this->hasMany(VehicleReport::class, 'car_id');
    }

    public function devices()
    {
        return $this->hasMany(Device::class, 'car_id');
    }

    public function schedules()
    {
        return $this->hasMany(VehicleSchedule::class, 'car_id');
    }
}