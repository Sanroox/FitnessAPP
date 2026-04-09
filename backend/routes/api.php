<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControladorAuth;
use App\Http\Controllers\ControladorEjercicio;
use App\Http\Controllers\ControladorRutina;
use App\Http\Controllers\ControladorAdmin;

/*
|--------------------------------------------------------------------------
| Rutas de la API - Plataforma de Rutinas de Entrenamiento
|--------------------------------------------------------------------------
*/

// Rutas públicas
Route::post('/registro',        [ControladorAuth::class, 'registrar']);
Route::post('/inicio-sesion',   [ControladorAuth::class, 'iniciarSesion']);

// Rutas protegidas (requieren token Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/cerrar-sesion', [ControladorAuth::class, 'cerrarSesion']);
    Route::get('/perfil',         [ControladorAuth::class, 'perfil']);

    // Ejercicios
    Route::get('/ejercicios',           [ControladorEjercicio::class, 'listar']);
    Route::get('/ejercicios/{id}',      [ControladorEjercicio::class, 'mostrar']);
    Route::get('/grupos-musculares',    [ControladorEjercicio::class, 'gruposMusculares']);

    // Rutinas del usuario autenticado
    Route::get('/rutinas',              [ControladorRutina::class, 'listar']);
    Route::post('/rutinas',             [ControladorRutina::class, 'crear']);
    Route::get('/rutinas/{id}',         [ControladorRutina::class, 'mostrar']);
    Route::put('/rutinas/{id}',         [ControladorRutina::class, 'actualizar']);
    Route::delete('/rutinas/{id}',      [ControladorRutina::class, 'eliminar']);

    Route::post('/rutinas/{id}/ejercicios',              [ControladorRutina::class, 'agregarEjercicio']);
    Route::put('/rutinas/{id}/ejercicios/{ejId}',        [ControladorRutina::class, 'actualizarEjercicio']);
    Route::delete('/rutinas/{id}/ejercicios/{ejId}',     [ControladorRutina::class, 'quitarEjercicio']);

    // Panel de administración
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/usuarios',                  [ControladorAdmin::class, 'usuarios']);
        Route::put('/usuarios/{id}/rol',         [ControladorAdmin::class, 'actualizarRol']);
        Route::delete('/usuarios/{id}',          [ControladorAdmin::class, 'eliminarUsuario']);
        Route::post('/sincronizar-ejercicios',   [ControladorAdmin::class, 'sincronizarEjercicios']);
        Route::get('/estadisticas',              [ControladorAdmin::class, 'estadisticas']);
    });
});
