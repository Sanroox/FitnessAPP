<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// Laravel busca esta clase por defecto al ejecutar php artisan migrate --seed
// Desde aquí llamamos a nuestro SeederBaseDatos
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(SeederBaseDatos::class);
    }
}
