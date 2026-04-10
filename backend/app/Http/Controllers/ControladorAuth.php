<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ControladorAuth extends Controller
{
    public function registrar(Request $request)
    {
        $validado = $request->validate([
            'nombre'               => 'required|string|max:255',
            'email'                => 'required|string|email|max:255|unique:usuarios',
            'contrasena'           => 'required|string|min:8|confirmed',
            'contrasena_confirmation' => 'required',
        ]);

        $usuario = Usuario::create([
            'nombre'    => $validado['nombre'],
            'email'     => $validado['email'],
            'contrasena'=> Hash::make($validado['contrasena']),
            'rol'       => 'usuario',
        ]);

        $token = $usuario->createToken('token_auth')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token'   => $token,
        ], 201);
    }

    public function iniciarSesion(Request $request)
    {
        $request->validate([
            'email'      => 'required|email',
            'contrasena' => 'required',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $usuario->createToken('token_auth')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token'   => $token,
        ]);
    }

    public function cerrarSesion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['mensaje' => 'Sesión cerrada correctamente.']);
    }

    public function perfil(Request $request)
    {
        return response()->json($request->user());
    }
}
