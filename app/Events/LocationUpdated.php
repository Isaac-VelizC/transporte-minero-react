<?php

namespace App\Events;

use App\Models\Device;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    //public $device;
    /**
     * Create a new event instance.
     */
    public function __construct(public Device $device)
    {
        //$this->device = $device;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('devices.' . $this->device->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'deviceId' => $this->device->id,
            'latitude' => $this->device->last_latitude,
            'longitude' => $this->device->last_longitude,
        ];
    }
}
