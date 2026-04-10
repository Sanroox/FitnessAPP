<?php

namespace Database\Seeders;

use App\Models\Usuario;
use App\Models\Ejercicio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SeederBaseDatos extends Seeder
{
    public function run(): void
    {
        // Admin de prueba
        Usuario::create([
            'nombre'     => 'Administrador',
            'email'      => 'admin@fitapp.com',
            'contrasena' => Hash::make('password'),
            'rol'        => 'admin',
        ]);

        // Usuario de prueba
        Usuario::create([
            'nombre'     => 'Mario San Román',
            'email'      => 'mario@fitapp.com',
            'contrasena' => Hash::make('password'),
            'rol'        => 'usuario',
        ]);

        // Ejercicios de ejemplo
        $ejercicios = [
            ['nombre' => 'Press de banca',      'grupo_muscular' => 'pecho',         'musculo_objetivo' => 'pectoral mayor',   'equipamiento' => 'barra'],
            ['nombre' => 'Sentadilla',           'grupo_muscular' => 'piernas',       'musculo_objetivo' => 'cuádriceps',       'equipamiento' => 'barra'],
            ['nombre' => 'Peso muerto',          'grupo_muscular' => 'espalda',       'musculo_objetivo' => 'columna',          'equipamiento' => 'barra'],
            ['nombre' => 'Dominadas',            'grupo_muscular' => 'espalda',       'musculo_objetivo' => 'dorsales',         'equipamiento' => 'peso corporal'],
            ['nombre' => 'Press militar',        'grupo_muscular' => 'hombros',       'musculo_objetivo' => 'deltoides',        'equipamiento' => 'barra'],
            ['nombre' => 'Curl de bíceps',       'grupo_muscular' => 'brazos',        'musculo_objetivo' => 'bíceps braquial',  'equipamiento' => 'mancuerna'],
            ['nombre' => 'Extensión de tríceps', 'grupo_muscular' => 'brazos',        'musculo_objetivo' => 'tríceps braquial', 'equipamiento' => 'cable'],
            ['nombre' => 'Zancadas',             'grupo_muscular' => 'piernas',       'musculo_objetivo' => 'cuádriceps',       'equipamiento' => 'mancuerna'],
            ['nombre' => 'Remo con barra',       'grupo_muscular' => 'espalda',       'musculo_objetivo' => 'trapecio',         'equipamiento' => 'barra'],
            ['nombre' => 'Fondos en paralelas',  'grupo_muscular' => 'pecho',         'musculo_objetivo' => 'tríceps braquial', 'equipamiento' => 'peso corporal'],
            ['nombre' => 'Plancha',              'grupo_muscular' => 'abdominales',   'musculo_objetivo' => 'abdominales',      'equipamiento' => 'peso corporal'],
            ['nombre' => 'Elevación lateral',    'grupo_muscular' => 'hombros',       'musculo_objetivo' => 'deltoides',        'equipamiento' => 'mancuerna'],
        ];

        foreach ($ejercicios as $ej) {
            Ejercicio::create($ej);
        }
    }
}
