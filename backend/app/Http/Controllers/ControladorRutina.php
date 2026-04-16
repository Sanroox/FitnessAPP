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

        // Pro: Usamos la relación del usuario para crear
        $rutina = $request->user()->rutinas()->create($validado);

        return response()->json($rutina, 201);
    }

    /**
     * Mostrar una rutina específica con todos sus ejercicios y datos de carga.
     */
    public function mostrar(Request $request, $id): JsonResponse
    {
        // Pro: Cargamos los ejercicios directamente
        $rutina = $request->user()->rutinas()
            ->with('ejercicios')
            ->findOrFail($id);

        return response()->json($rutina);
    }

    /**
     * Agregar un ejercicio a la rutina (Uso de Pivot).
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

        // Lógica de orden Pro
        if (!isset($validado['orden'])) {
            $validado['orden'] = ($rutina->ejercicios()->max('orden') ?? -1) + 1;
        }

        // Pro: Usamos attach() para la tabla intermedia
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

        // Pro: Usamos updateExistingPivot() para no tener que buscar la fila a mano
        $rutina->ejercicios()->updateExistingPivot($ejercicioId, $validado);

        return response()->json(['mensaje' => 'Datos de ejercicio actualizados']);
    }

    /**
     * Quitar un ejercicio de la rutina.
     */
    public function quitarEjercicio(Request $request, $id, $ejercicioId): JsonResponse
    {
        $rutina = $request->user()->rutinas()->findOrFail($id);

        // Pro: detach() elimina la relación en la tabla intermedia
        $rutina->ejercicios()->detach($ejercicioId);

        return response()->json(['mensaje' => 'Ejercicio quitado de la rutina.']);
    }

}