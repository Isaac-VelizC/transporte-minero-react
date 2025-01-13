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
        'geofence_id',
        'client_id',
        'conductor_id',
        'peso',
        'origen',
        'destino',
        'status',
        'delete',
        'fecha_envio',
        'fecha_entrega',
        'client_latitude',
        'client_longitude',
        'origen_latitude',
        'origen_longitude',
        'notas',
        'sub_total',
        'total'
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

    public function altercadoReports() {
        return $this->hasMany(AltercationReport::class, 'envio_id');
    }
}
