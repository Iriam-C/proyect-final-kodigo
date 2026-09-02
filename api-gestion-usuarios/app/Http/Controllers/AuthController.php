<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Registrar un nuevo usuario
    public function register(Request $request)
    {
        $datos = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $usuarioId = DB::table('users')->insertGetId([
            'name' => $datos['name'],
            'apellido' => $datos['apellido'],
            'email' => $datos['email'],
            'password' => Hash::make($datos['password']),
            'role_id' => 6,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $usuario = User::find($usuarioId);

        $token = $usuario->createToken('api-token')->plainTextToken;

        $usuarioInfo = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id',
                'users.name',
                'users.apellido',
                'users.email',
                'roles.nombre as rol'
            )
            ->where('users.id', $usuario->id)
            ->first();

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuarioInfo,
            'token' => $token,
        ], 201);
    }

    // Iniciar sesión
    public function login(Request $request)
    {
        $datos = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $usuarioDatos = DB::table('users')->where('email', $datos['email'])->first();

        if (!$usuarioDatos || !Hash::check($datos['password'], $usuarioDatos->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $usuario = User::find($usuarioDatos->id);

        $token = $usuario->createToken('api-token')->plainTextToken;

        $usuarioInfo = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id',
                'users.name',
                'users.apellido',
                'users.email',
                'roles.nombre as rol'
            )
            ->where('users.id', $usuario->id)
            ->first();

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'usuario' => $usuarioInfo,
            'token' => $token,
        ]);
    }

    // Cerrar sesión
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

        public function refresh(Request $request)
    {
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Token renovado correctamente',
            'token' => $token
        ]);
    }
}