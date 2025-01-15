<?php

namespace App\Events;

use App\Models\RutaDevice;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RutaEnvioDeviceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ruta_device;
    /**
     * Create a new event instance.
     */
    public function __construct(RutaDevice $ruta)
    {
        $this->ruta_device = $ruta;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()//: array
    {
        return new Channel('rutas_device');
        /*return [
            new PrivateChannel('channel-name'),
        ];*/
        // Si deseas que el canal sea privado, usa PrivateChannel
        // Puedes personalizar el canal por ID o cualquier otro identificador
        //return new PrivateChannel('rutas_device.' . $this->ruta_device->id); 
    }
}
