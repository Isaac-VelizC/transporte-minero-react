<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Geocerca extends Model
{
    use HasFactory;

    protected $table = 'geocercas';

    protected $fillable = [
        'name',
        'polygon_coordinates',
        'latitude',
        'longitude',
        'radius',
        'type',
        'description',
        'is_active',
        'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function envios()
    {
        return $this->hasMany(CargoShipment::class, 'geofence_id');
    }
}
