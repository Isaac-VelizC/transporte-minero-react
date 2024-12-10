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
        'client_id',
        'peso',
        'destino',
        'status',
        'fecha_envio',
        'fecha_entrega',
        'notas'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}