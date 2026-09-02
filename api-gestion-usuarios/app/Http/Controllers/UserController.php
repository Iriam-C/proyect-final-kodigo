<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // Listar todos los usuarios
    public function index()
    {
        $usuarios = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id',
                'users.name',
                'users.apellido',
                'users.email',
                'roles.nombre as rol'
            )
            ->get();

        return response()->json([
            'usuarios' => $usuarios
        ]);
    }

    // Mostrar un usuario específico
    public function show($id)
    {
        $usuario = DB::table('users')->where('id', $id)->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json([
            'usuario' => $usuario
        ]);
    }

    // Crear un usuario
    public function store(Request $request)
    {
        $rolId = DB::table('users')
            ->where('id', $request->user()->id)
            ->value('role_id');

        if (!in_array($rolId, [4, 5])) {
            return response()->json([
                'message' => 'No tienes permisos para crear usuarios'
            ], 403);
        }

        $datos = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $datos['password'] = Hash::make($datos['password']);

        $usuarioId = DB::table('users')->insertGetId([
            'name' => $datos['name'],
            'apellido' => $datos['apellido'],
            'email' => $datos['email'],
            'password' => $datos['password'],
            'role_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $usuario = DB::table('users')->where('id', $usuarioId)->first();

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'usuario' => $usuario
        ], 201);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $rolId = DB::table('users')
            ->where('id', $request->user()->id)
            ->value('role_id');

        if (!in_array($rolId, [4, 5])) {
            return response()->json([
                'message' => 'No tienes permisos para editar usuarios'
            ], 403);
        }
    
        $usuario = DB::table('users')->where('id', $id)->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $datos = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'apellido' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
        ]);

        if (isset($datos['password'])) {
            $datos['password'] = Hash::make($datos['password']);
        }

        $datos['updated_at'] = now();

        DB::table('users')->where('id', $id)->update($datos);

        $usuario = DB::table('users')->where('id', $id)->first();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'usuario' => $usuario
        ]);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $rolId = DB::table('users')
            ->where('id', request()->user()->id)
            ->value('role_id');

        if ($rolId != 4) {
            return response()->json([
                'message' => 'No tienes permisos para eliminar usuarios'
            ], 403);
        }
        
        $usuario = DB::table('users')->where('id', $id)->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        DB::table('users')->where('id', $id)->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

        public function estadisticas()
    {
        $hoy = now();

        $porDia = DB::table('users')
        ->whereDate('created_at', $hoy->toDateString())->count();

        $porSemana = DB::table('users')
            ->whereBetween('created_at', [
                $hoy->copy()->startOfWeek(),
                $hoy->copy()->endOfWeek()
            ])->count();

        $porMes = DB::table('users')
            ->whereMonth('created_at', $hoy->month)
            ->whereYear('created_at', $hoy->year)
            ->count();
        
       
       return response()->json([
            'usuarios_registrados' => [
                'hoy' => $porDia,
                'esta_semana' => $porSemana,
                'este_mes' => $porMes
            ]
        ]);
    }
}