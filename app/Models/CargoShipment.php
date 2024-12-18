<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CargoShipment extends Model
{
    use HasFactory;

    protected $table = 'cargo_shipments';

    protected $fillable = [
        'car_id',
        'programming',
        'client_id',
        'conductor_id',
        'geofence_id',
        'peso',
        'destino',
        'status',
        'fecha_envio',
        'fecha_entrega',
        'client_latitude',
        'client_longitude',
        'notas',
        'delete'
    ];

    public function formatFullName(): string
    {
        return trim(
            ($this->client->nombre ?? '') . ' ' .
                ($this->client->ap_pat ?? '') . ' ' .
                ($this->client->ap_mat ?? '')
        );
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }

    public function client()
    {
        return $this->belongsTo(Persona::class, 'client_id');
    }

    public function conductor()
    {
        return $this->belongsTo(Persona::class, 'conductor_id');
    }

    public function schedule()
    {
        return $this->belongsTo(VehicleSchedule::class, 'programming');
    }

    public function geocerca()
    {
        return $this->belongsTo(Geocerca::class, 'geofence_id');
    }
}
