<?php

use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Support\Facades\Route;

// Bla login
Route::post('/login', [AuthController::class, 'login']);

// Khass token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Assistant + médecin
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);

    // Assistant ghir
    Route::middleware('role:assistant')->group(function () {
        Route::post('/patients', [PatientController::class, 'store']);
        Route::put('/patients/{patient}', [PatientController::class, 'update']);
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
    });

    // Médecin ghir
    Route::middleware('role:medecin')->group(function () {
        Route::get('/assistants', [AssistantController::class, 'index']);
        Route::post('/assistants', [AssistantController::class, 'store']);
        Route::get('/assistants/{id}', [AssistantController::class, 'show']);
        Route::put('/assistants/{id}', [AssistantController::class, 'update']);
        Route::delete('/assistants/{id}', [AssistantController::class, 'destroy']);
    });
});