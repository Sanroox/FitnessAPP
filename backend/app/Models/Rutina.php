<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Rutina extends Model
{
    protected $table = 'rutinas';

    // Campos que permitimos llenar masivamente
    protected $fillable = [
        'usuario_id',
        'nombre',
        'descripcion',
    ];

    /**
     * Relación: La rutina pertenece a un usuario (Dueño).
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Relación: Una rutina tiene muchos ejercicios y un ejercicio está en muchas rutinas.
     * Aquí es donde recuperamos los datos de la tabla intermedia (series, reps, etc.)
     */
    public function ejercicios(): BelongsToMany
    {
        return $this->belongsToMany(Ejercicio::class, 'rutina_ejercicios')
                    ->withPivot('series', 'repeticiones', 'descanso_seg', 'notas', 'orden')
                    ->withTimestamps()
                    ->orderByPivot('orden', 'asc');
    }
}