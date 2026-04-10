<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Autenticable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Autenticable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'email',
        'contrasena',
        'rol',
    ];

    protected $hidden = [
        'contrasena',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'contrasena'        => 'hashed',
    ];

    // Necesario para que Sanctum use el campo correcto
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    public function rutinas()
    {
        return $this->hasMany(Rutina::class, 'usuario_id');
    }

    public function esAdmin(): bool
    {
        return $this->rol === 'admin';
    }
}
