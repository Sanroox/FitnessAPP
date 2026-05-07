<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControladorAuth;
use App\Http\Controllers\ControladorEjercicio;
use App\Http\Controllers\ControladorRutina;
use App\Http\Controllers\ControladorAdmin;

// --- RUTAS PÚBLICAS ---
Route::post('/registro',        [ControladorAuth::class, 'registrar']);
Route::post('/inicio-sesion',   [ControladorAuth::class, 'iniciarSesion']);

// --- RUTAS PROTEGIDAS ---
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/cerrar-sesion', [ControladorAuth::class, 'cerrarSesion']);
    Route::get('/perfil',         [ControladorAuth::class, 'perfil']);

    // --- EJERCICIOS ---
    Route::prefix('ejercicios')->group(function () {
        Route::get('/',           [ControladorEjercicio::class, 'listar']);
        Route::get('/grupos',     [ControladorEjercicio::class, 'gruposMusculares']);
        Route::get('/{id}',       [ControladorEjercicio::class, 'mostrar']);
    });

    // --- RUTINAS ---
    Route::prefix('rutinas')->group(function () {
        Route::get('/',           [ControladorRutina::class, 'listar']);
        Route::post('/',          [ControladorRutina::class, 'crear']);
        Route::get('/{id}',       [ControladorRutina::class, 'mostrar']);
        Route::put('/{id}',       [ControladorRutina::class, 'actualizar']);
        Route::delete('/{id}',    [ControladorRutina::class, 'eliminar']);

        // Gestión de Ejercicios dentro de la rutina
        Route::post('/{id}/ejercicios',                [ControladorRutina::class, 'agregarEjercicio']);
        Route::put('/{id}/ejercicios/{ejId}',          [ControladorRutina::class, 'actualizarEjercicio']);
        Route::delete('/{rutina}/ejercicios/{ejId}',   [ControladorRutina::class, 'quitarEjercicio']);
    });

    // --- ADMIN ---
    Route::prefix('admin')->group(function () {
        Route::get('/estadisticas',            [ControladorAdmin::class, 'estadisticas']);
        Route::get('/usuarios',                [ControladorAdmin::class, 'usuarios']);
        Route::put('/usuarios/{id}/rol',       [ControladorAdmin::class, 'actualizarRol']);
        Route::delete('/usuarios/{id}',        [ControladorAdmin::class, 'eliminarUsuario']);
        Route::post('/sincronizar-ejercicios', [ControladorAdmin::class, 'sincronizarEjercicios']);
    });
});