<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Listar todos los usuarios
    public function index()
    {
        $usuarios = User::all();

        return response()->json([
            'usuarios' => $usuarios
        ]);
    }

    // Mostrar un usuario específico
    public function show($id)
    {
        $usuario = User::find($id);

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
        $datos = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $datos['password'] = Hash::make($datos['password']);

        $usuario = User::create($datos);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'usuario' => $usuario
        ], 201);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $usuario = User::find($id);

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

        $usuario->update($datos);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'usuario' => $usuario
        ]);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $usuario->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

        public function estadisticas()
    {
        $hoy = now();

        $porDia = User::whereDate('created_at', $hoy->toDateString())->count();

        $porSemana = User::whereBetween('created_at', [
            $hoy->copy()->startOfWeek(),
            $hoy->copy()->endOfWeek()
        ])->count();

        $porMes = User::whereMonth('created_at', $hoy->month)
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