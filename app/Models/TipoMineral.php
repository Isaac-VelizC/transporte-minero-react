<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoMineral extends Model
{
    use HasFactory;

    protected $table = 'tipo_minerals';

    protected $fillable = [
        'nombre',
        'precio'
    ];

    public function envios() {
        return $this->hasMany(CargoShipment::class, 'mineral_id');
    }
}
