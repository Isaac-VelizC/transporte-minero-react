<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleTrajectorie extends Model
{
    use HasFactory;

    protected $table = 'vehicle_trajectories';

    protected $fillable = [
        'car_id',
        'start_point',
        'end_point',
        'path',
        'start_time',
        'end_time',
        'distance',
        'status'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'car_id');
    }
}
