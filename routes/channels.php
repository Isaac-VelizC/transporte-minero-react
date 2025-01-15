<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/** Canales publicos  */
/*Broadcast::channel('devices', function () {
    // Aquí puedes agregar la lógica para verificar si el usuario está autorizado
    return true; // o false dependiendo de la autorización
});*/

//Broadcast::channel('devices');
//Broadcast::channel('rutas_device');

Broadcast::channel('devices', function ($user) {
    return true;
});

Broadcast::channel('rutas_device', function ($user) {
    return true;
});