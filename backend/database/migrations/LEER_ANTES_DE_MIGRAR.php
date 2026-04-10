<?php
// NOTA IMPORTANTE
// ---------------
// Laravel genera por defecto estas migraciones al instalar el proyecto:
//   - create_users_table
//   - create_password_reset_tokens_table
//   - create_personal_access_tokens_table
//
// Antes de ejecutar php artisan migrate debes ELIMINAR la migración
// create_users_table porque entra en conflicto con crear_tabla_usuarios.
//
// Las otras dos (password_reset y personal_access_tokens) puedes dejarlas
// ya que Sanctum las necesita para los tokens de autenticación.
//
// Pasos:
//   1. Borra el archivo database/migrations/XXXX_create_users_table.php
//   2. Ejecuta: php artisan migrate --seed
