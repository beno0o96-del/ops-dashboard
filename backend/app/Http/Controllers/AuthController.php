<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');

        $user = User::where('email', $identifier)
            ->orWhere('name', $identifier)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('web')->plainTextToken;
        } else {
            return response()->json(['message' => 'Sanctum not available'], 500);
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out']);
    }
}

