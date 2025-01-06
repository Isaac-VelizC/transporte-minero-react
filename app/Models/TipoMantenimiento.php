<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoMantenimiento extends Model
{
    public $timestamps = false;
    
    protected $table = 'tipo_mantenimientos';

    protected $fillable = [
        'name',
    ];

    public function mantenimietos()
    {
        return $this->hasMany(VehiculoMantenimiento::class, 'tipo');
    }
}