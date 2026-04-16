<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    protected $table = 'ejercicios';

    protected $fillable = [
        'id_externo',
        'nombre',
        'grupo_muscular',
        'musculo_objetivo',
        'equipamiento',
        'url_gif',
        'instrucciones',
    ];

    public function rutinaEjercicios()
    {
        return $this->hasMany(RutinaEjercicio::class, 'ejercicio_id');
    }
}
