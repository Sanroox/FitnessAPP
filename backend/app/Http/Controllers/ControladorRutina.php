<?php

namespace App\Http\Controllers;

use App\Models\Rutina;
use App\Models\Ejercicio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ControladorRutina extends Controller
{
    /**
     * Listar las rutinas del usuario con el conteo de ejercicios.
     */
    public function listar(Request $request): JsonResponse
    {
        $rutinas = $request->user()->rutinas()
            ->withCount('ejercicios')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rutinas);
    }

    /**
     * Crear una nueva rutina vinculada al usuario.
     */
    public function crear(Request $request): JsonResponse
    {
        $validado = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $rutina = $request->user()->rutinas()->create($validado);

        return response()->json($rutina, 201);
    }

    /**
     * Mostrar una rutina específica con todos sus ejercicios.
     */
    public function mostrar(Request $request, $id): JsonResponse
    {
        $rutina = $request->user()->rutinas()
            ->with('ejercicios')
            ->findOrFail($id);

        return response()->json($rutina);
    }

    /**
     * Agregar un ejercicio a la rutina.
     */
    public function agregarEjercicio(Request $request, $id): JsonResponse
    {
        $rutina = $request->user()->rutinas()->findOrFail($id);

        $validado = $request->validate([
            'ejercicio_id'  => 'required|exists:ejercicios,id',
            'series'        => 'required|integer|min:1|max:20',
            'repeticiones'  => 'required|integer|min:1|max:100',
            'descanso_seg'  => 'nullable|integer|min:0|max:600',
            'notas'         => 'nullable|string|max:500',
            'orden'         => 'nullable|integer|min:0',
        ]);

        if (!isset($validado['orden'])) {
            $validado['orden'] = ($rutina->ejercicios()->max('orden') ?? -1) + 1;
        }

        $rutina->ejercicios()->attach($validado['ejercicio_id'], [
            'series'       => $validado['series'],
            'repeticiones' => $validado['repeticiones'],
            'descanso_seg' => $validado['descanso_seg'] ?? 60,
            'notas'        => $validado['notas'] ?? null,
            'orden'        => $validado['orden'],
        ]);

        return response()->json(['mensaje' => 'Ejercicio añadido con éxito'], 201);
    }

    /**
     * Actualizar los datos de un ejercicio ya existente en la rutina.
     */
    public function actualizarEjercicio(Request $request, $id, $ejercicioId): JsonResponse
    {
        $rutina = $request->user()->rutinas()->findOrFail($id);

        $validado = $request->validate([
            'series'       => 'sometimes|integer|min:1|max:20',
            'repeticiones' => 'sometimes|integer|min:1|max:100',
            'descanso_seg' => 'nullable|integer|min:0|max:600',
            'notas'        => 'nullable|string|max:500',
            'orden'        => 'nullable|integer|min:0',
        ]);

        $rutina->ejercicios()->updateExistingPivot($ejercicioId, $validado);

        return response()->json(['mensaje' => 'Datos de ejercicio actualizados']);
    }

    /**
     * Quitar un ejercicio de la rutina.
     * He ajustado los parámetros para que coincidan con la ruta /{rutina}/ejercicios/{ejId}
     */
    public function quitarEjercicio(Rutina $rutina, $ejId): JsonResponse
    {
        // detach() elimina la relación en la tabla intermedia
        $rutina->ejercicios()->detach($ejId);

        return response()->json([
            'mensaje' => 'Ejercicio quitado de la rutina.',
            'rutina_id' => $rutina->id,
            'ejercicio_id' => $ejId
        ], 200);
    }
/**
     * Eliminar una rutina completa.
     */
    public function eliminar(Request $request, $id): JsonResponse
    {
        // 1. Buscamos la rutina por ID
        $rutina = Rutina::findOrFail($id);

        // 2. SEGURIDAD: Solo el dueño o un ADMIN pueden borrarla
        if ($rutina->usuario_id !== $request->user()->id && $request->user()->rol !== 'admin') {
            return response()->json(['mensaje' => 'No tienes permisos para realizar esta acción.'], 403);
        }

        // 3. Limpiamos la tabla pivote antes de borrar
        // Esto elimina las relaciones en la tabla 'rutina_ejercicio'
        $rutina->ejercicios()->detach();

        // 4. Borramos la rutina
        $rutina->delete();

        return response()->json(['mensaje' => 'Rutina eliminada correctamente.']);
    }

}