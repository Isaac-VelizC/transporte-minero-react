<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';

    protected $fillable = [
        'client_id',
        'control_id',
        'body',
        'receptor',
        'fecha'
    ];

    public function cliente()
    {
        return $this->belongsTo(Persona::class, 'client_id');
    }
    
    public function control()
    {
        return $this->belongsTo(Persona::class, 'control_id');
    }
}
