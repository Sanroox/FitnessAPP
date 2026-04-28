<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rutina_ejercicios', function (Blueprint $table) {
            $table->id();
            // Relación con la tabla de rutinas que acabamos de crear
            $table->foreignId('rutina_id')->constrained('rutinas')->onDelete('cascade');
            // Relación con la tabla de ejercicios
            $table->foreignId('ejercicio_id')->constrained('ejercicios')->onDelete('cascade');
            
            // Campos adicionales para el entrenamiento
            $table->integer('series')->default(3);
            $table->integer('repeticiones')->default(10);
            $table->integer('descanso_seg')->default(60);
            $table->text('notas')->nullable();
            $table->integer('orden')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutina_ejercicios');
    }
};