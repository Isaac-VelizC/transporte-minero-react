<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AltercationReport extends Model
{
    use HasFactory;

    protected $table = 'altercation_reports';

    protected $fillable = [
        'car_id',
        'envio_id',
        'driver_id',
        'tipo_altercado',
        'description',
        'fecha',
        'last_latitude',
        'last_longitude'
    ];

    public function envio()
    {
        return $this->belongsTo(CargoShipment::class, 'envio_id');
    }

    public function driver() {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function vehiculo() {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }
}
