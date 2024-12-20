<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!Auth::user()->hasRole($role)) {
            abort(403, 'No tienes permiso para acceder a esta página.');
        }
        return $next($request);
    }

    /*public function handle($request, Closure $next, ...$roles)
    {
        if (!Auth::check() || !collect($roles)->contains(Auth::user()->getRoleNames()->first())) {
            return redirect('/');
        }

        return $next($request);
    }*/
}
