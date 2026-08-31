# API Gestión de Usuarios

API para gestionar usuarios utilizando Laravel y MySQL.

## Tecnologías

* Laravel 13
* PHP 8.3
* MySQL
* Laravel Sanctum
* Postman
* Composer

## Funciones

* Registrar usuarios
* Iniciar y cerrar sesión
* Renovar token
* Listar usuarios
* Ver usuarios
* Crear, actualizar y eliminar usuarios
* Consultar estadísticas por día, semana y mes

## Rutas principales

`POST /api/register` — Registrar usuario
`POST /api/login` — Iniciar sesión
`POST /api/logout` — Cerrar sesión
`POST /api/refresh` — Renovar token

`GET /api/usuarios` — Listar usuarios
`GET /api/usuarios/{id}` — Ver usuario
`POST /api/usuarios` — Crear usuario
`PUT /api/usuarios/{id}` — Actualizar usuario
`DELETE /api/usuarios/{id}` — Eliminar usuario

`GET /api/estadisticas` — Ver estadísticas

## Autenticación

Se utiliza Laravel Sanctum para proteger las rutas. El token obtenido al iniciar sesión se coloca en Postman como **Bearer Token**.

## Base de datos

Se utiliza MySQL con la tabla `users` para almacenar la información de los usuarios.

## Instalación

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

La API se puede probar en Postman usando:

`http://127.0.0.1:8000`
