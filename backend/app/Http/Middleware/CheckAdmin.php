<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // Asegúrate de que esta línea esté aquí

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Comprobamos si el usuario está logueado Y si es administrador
        if (Auth::check() && $request->user()->esAdmin()) {
            return $next($request); // Si todo ok, le dejamos pasar a la ruta
        }

        // 2. Si no es admin, le devolvemos el error 403 (Prohibido)
        return response()->json([
            'message' => 'No tienes permisos de administrador para acceder a este panel.'
        ], 403);
    }
}