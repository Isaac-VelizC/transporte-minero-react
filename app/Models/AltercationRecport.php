<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AltercationRecport extends Model
{
    use HasFactory;

    protected $table = 'altercation_recports';

    protected $fillable = [
        'envio_id',
        'driver_id',
        'description',
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
}
