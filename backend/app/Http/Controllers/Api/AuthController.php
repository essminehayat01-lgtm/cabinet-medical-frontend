<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth)
    {
    }

    public function login(LoginRequest $request)
    {
        return response()->json(
            $this->auth->connecter($request->email, $request->password)
        );
    }

    public function logout(Request $request)
    {
        $this->auth->deconnecter($request->user());

        return response()->noContent();
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}