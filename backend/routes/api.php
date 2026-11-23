<?php

use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);

    Route::middleware('role:assistant')->group(function () {
        Route::post('/patients', [PatientController::class, 'store']);
        Route::put('/patients/{patient}', [PatientController::class, 'update']);
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
    });

    Route::middleware('role:medecin')->group(function () {
        Route::get('/assistants', [AssistantController::class, 'index']);
        Route::post('/assistants', [AssistantController::class, 'store']);
        Route::get('/assistants/{id}', [AssistantController::class, 'show']);
        Route::put('/assistants/{id}', [AssistantController::class, 'update']);
        Route::delete('/assistants/{id}', [AssistantController::class, 'destroy']);
    });
});