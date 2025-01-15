<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';

    protected $fillable = [
        'client_id',
        'driver_id',
        'body',
        'fecha'
    ];

    public function cliente()
    {
        return $this->belongsTo(Persona::class, 'client_id');
    }
    
    public function driver()
    {
        return $this->belongsTo(Persona::class, 'driver_id');
    }
}
