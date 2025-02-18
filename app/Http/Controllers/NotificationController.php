<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->unreadNotifications);
    }
    
    public function show($id)
    {
        // Buscar la notificación por ID del usuario autenticado
        $notification = Auth::user()->notifications()->find($id);
        // Si no existe, devolver un error o redirigir a un fallback
        if (!$notification) {
            return redirect()->route('dashboard')->with('error', 'Notificación no encontrada');
        }

        // Marcar como leída
        $notification->markAsRead();

        // Redirigir a la URL asociada o a un fallback si no existe
        return redirect(optional($notification->data)['actionURL'] ?? route('dashboard'));
    }
}
