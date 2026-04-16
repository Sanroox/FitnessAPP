<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->id();
            $table->string('id_externo')->unique()->nullable(); 
            $table->string('nombre');
            $table->string('grupo_muscular');
            $table->string('musculo_objetivo')->nullable();
            $table->string('equipamiento')->nullable();
            $table->string('url_gif')->nullable();
            $table->text('instrucciones')->nullable();
            $table->timestamps();

            $table->index('grupo_muscular');
            $table->index('equipamiento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicios');
    }
};
