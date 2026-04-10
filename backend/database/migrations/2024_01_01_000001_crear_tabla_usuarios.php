<?php
// database/migrations/2024_01_01_000001_crear_tabla_usuarios.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email')->unique();
            $table->string('contrasena');
            $table->enum('rol', ['usuario', 'admin'])->default('usuario');
            $table->rememberToken();
            $table->timestamp('email_verificado_en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
