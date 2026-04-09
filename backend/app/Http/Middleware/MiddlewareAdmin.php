<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MiddlewareAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->esAdmin()) {
            return response()->json(['mensaje' => 'Acceso denegado. Se requiere rol de administrador.'], 403);
        }

        return $next($request);
    }
}
