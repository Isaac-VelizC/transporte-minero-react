<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CargoShipment extends Model
{
    use HasFactory;

    protected $table = 'cargo_shipments';

    protected $fillable = [
        'programming',
        'client_id',
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
        'mineral_id',
        'notas',
        'sub_total',
        'total'
    ];

    public function client()
    {
        return $this->belongsTo(Persona::class, 'client_id');
    }

    public function vehicleSchedules()
    {
        return $this->belongsToMany(VehicleSchedule::class, 'cargo_shipment_vehicle_schedule', 'cargo_shipment_id', 'vehicle_schedule_id');
    }

    public function altercadoReports() {
        return $this->hasMany(AltercationReport::class, 'envio_id');
    }

    public function mineral() {
        return $this->belongsTo(TipoMineral::class, 'mineral_id');
    }
}
