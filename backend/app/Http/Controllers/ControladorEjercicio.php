<?php

namespace App\Http\Controllers;

use App\Models\Ejercicio;
use Illuminate\Http\Request;

class ControladorEjercicio extends Controller
{
    public function listar(Request $request)
    {
        $consulta = Ejercicio::query();

        if ($request->filled('grupo_muscular')) {
            $consulta->where('grupo_muscular', $request->grupo_muscular);
        }

        if ($request->filled('buscar')) {
            $consulta->where('nombre', 'like', '%' . $request->buscar . '%');
        }

        if ($request->filled('equipamiento')) {
            $consulta->where('equipamiento', $request->equipamiento);
        }

        $ejercicios = $consulta->orderBy('nombre')->paginate(20);

        return response()->json($ejercicios);
    }

    public function mostrar($id)
    {
        $ejercicio = Ejercicio::findOrFail($id);
        return response()->json($ejercicio);
    }

    public function gruposMusculares()
    {
        $grupos = Ejercicio::select('grupo_muscular')
            ->distinct()
            ->orderBy('grupo_muscular')
            ->pluck('grupo_muscular');

        return response()->json($grupos);
    }
}
