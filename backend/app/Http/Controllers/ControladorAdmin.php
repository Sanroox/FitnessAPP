<?php

namespace App\Http\Controllers;

use App\Models\Usuario; // Verifica si tu modelo es User o Usuario
use App\Models\Ejercicio;
use App\Models\Rutina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ControladorAdmin extends Controller
{
    public function usuarios()
    {
        $usuarios = Usuario::withCount('rutinas')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($usuarios);
    }

    public function actualizarRol(Request $request, $id)
    {
        $request->validate([
            'rol' => 'required|in:usuario,admin',
        ]);

        $usuario = Usuario::findOrFail($id);
        $usuario->update(['rol' => $request->rol]);
        return response()->json($usuario);
    }

    public function eliminarUsuario($id)
    {
        $usuario = Usuario::findOrFail($id);
        if ($usuario->id === auth()->id()) {
            return response()->json(['mensaje' => 'No puedes eliminarte a ti mismo.'], 403);
        }
        $usuario->delete();
        return response()->json(['mensaje' => 'Usuario eliminado correctamente.']);
    }

    public function sincronizarEjercicios()
    {
        $apiKey  = config('services.exercisedb.clave');
        $apiHost = 'exercisedb.p.rapidapi.com';
        $limite  = 1000;
        $offset  = 0;
        $total   = 0;

        try {
            do {
                $respuesta = Http::withHeaders([
                    'X-RapidAPI-Key'  => $apiKey,
                    'X-RapidAPI-Host' => $apiHost,
                ])->get("https://{$apiHost}/exercises", [
                    'limit'  => $limite,
                    'offset' => $offset,
                ]);

                if (!$respuesta->successful()) {
                    return response()->json(['mensaje' => 'Error API externa'], 502);
                }

                $ejercicios = $respuesta->json();
                foreach ($ejercicios as $ej) {
    Ejercicio::updateOrCreate(
        ['id_externo' => $ej['id']],
        [
            'nombre'          => ucfirst($ej['name'] ?? 'Sin nombre'),
            'grupo_muscular'  => $ej['bodyPart'] ?? 'Otros',
            'musculo_objetivo'=> $ej['target'] ?? 'General',
            'equipamiento'    => $ej['equipment'] ?? 'Ninguno',
            'url_gif'         => $ej['gifUrl'] ?? null, // <-- Aquí estaba el fallo, ahora es seguro
            'instrucciones'   => implode(' ', $ej['instructions'] ?? []),
        ]
    );
    $total++;
}
                $offset += $limite;
            } while (count($ejercicios) === $limite);

            return response()->json(['mensaje' => "Sincronizados {$total} ejercicios."]);
        } catch (\Exception $e) {
            return response()->json(['mensaje' => $e->getMessage()], 500);
        }
    }

    public function estadisticas()
    {
        return response()->json([
            'total_usuarios'   => Usuario::count(),
            'total_ejercicios' => Ejercicio::count(),
            'total_rutinas'    => Rutina::count(),
            'usuarios_semana'  => Usuario::where('created_at', '>=', now()->subWeek())->count(),
        ]);
    }
}