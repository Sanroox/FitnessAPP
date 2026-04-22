<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EjercicioTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
{
    \App\Models\Ejercicio::create([
        'nombre' => 'Press Militar',
        'grupo_muscular' => 'Hombro',
        'equipamiento' => 'Barra',
        'instrucciones' => 'Empuje vertical' // <--- Cambiado aquí
    ]);
    \App\Models\Ejercicio::create([
        'nombre' => 'Dominadas',
        'grupo_muscular' => 'Espalda',
        'equipamiento' => 'Corporal',
        'instrucciones' => 'Tracción vertical' // <--- Cambiado aquí
    ]);
    \App\Models\Ejercicio::create([
        'nombre' => 'Press de Banca',
        'grupo_muscular' => 'Pecho',
        'equipamiento' => 'Barra',
        'instrucciones' => 'Empuje horizontal' // <--- Cambiado aquí
    ]);
}
}
