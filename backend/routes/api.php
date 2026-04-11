<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControladorAuth;
use App\Http\Controllers\ControladorEjercicio;
// Comentamos estos porque aún no existen los archivos en tu carpeta
// use App\Http\Controllers\ControladorRutina;
// use App\Http\Controllers\ControladorAdmin;

/*
|--------------------------------------------------------------------------
| Rutas de la API - Plataforma de Rutinas de Entrenamiento
|--------------------------------------------------------------------------
*/

// --- RUTAS PÚBLICAS ---
Route::post('/registro',        [ControladorAuth::class, 'registrar']);
Route::post('/inicio-sesion',   [ControladorAuth::class, 'iniciarSesion']);

// --- RUTAS PROTEGIDAS (Requieren Token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación y Perfil
    Route::post('/cerrar-sesion', [ControladorAuth::class, 'cerrarSesion']);
    Route::get('/perfil',         [ControladorAuth::class, 'perfil']);

    // --- PUNTO 5: EJERCICIOS ---
    Route::get('/ejercicios',          [ControladorEjercicio::class, 'listar']);
    Route::get('/ejercicios/grupos',   [ControladorEjercicio::class, 'gruposMusculares']);
    Route::get('/ejercicios/{id}',     [ControladorEjercicio::class, 'mostrar']);

    /* COMENTADO HASTA EL PUNTO 7: RUTINAS
    Route::get('/rutinas',             [ControladorRutina::class, 'listar']);
    Route::post('/rutinas',            [ControladorRutina::class, 'crear']);
    Route::get('/rutinas/{id}',        [ControladorRutina::class, 'mostrar']);
    Route::put('/rutinas/{id}',        [ControladorRutina::class, 'actualizar']);
    Route::delete('/rutinas/{id}',     [ControladorRutina::class, 'eliminar']);

    Route::post('/rutinas/{id}/ejercicios',               [ControladorRutina::class, 'agregarEjercicio']);
    Route::put('/rutinas/{id}/ejercicios/{ejId}',         [ControladorRutina::class, 'actualizarEjercicio']);
    Route::delete('/rutinas/{id}/ejercicios/{ejId}',      [ControladorRutina::class, 'quitarEjercicio']);
    */

    /*
       COMENTADO HASTA EL PUNTO DE ADMIN
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/usuarios',                  [ControladorAdmin::class, 'usuarios']);
        Route::put('/usuarios/{id}/rol',         [ControladorAdmin::class, 'actualizarRol']);
        Route::delete('/usuarios/{id}',          [ControladorAdmin::class, 'eliminarUsuario']);
        Route::post('/sincronizar-ejercicios',   [ControladorAdmin::class, 'sincronizarEjercicios']);
        Route::get('/estadisticas',              [ControladorAdmin::class, 'estadisticas']);
    });
    */
});