<?php

use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DossierController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrdonnanceController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\RendezVousController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);
    Route::put('/patients/{patient}/dossier', [DossierController::class, 'update']);
    Route::get('/rendez-vous', [RendezVousController::class, 'index']);

    Route::middleware('role:assistant')->group(function () {
        Route::post('/patients', [PatientController::class, 'store']);
        Route::put('/patients/{patient}', [PatientController::class, 'update']);
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
        Route::post('/rendez-vous/{rendezVous}/reserver', [RendezVousController::class, 'reserver']);
        Route::put('/rendez-vous/{rendezVous}', [RendezVousController::class, 'update']);
        Route::delete('/rendez-vous/{rendezVous}', [RendezVousController::class, 'destroy']);
    });

    Route::middleware('role:medecin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/assistants', [AssistantController::class, 'index']);
        Route::post('/assistants', [AssistantController::class, 'store']);
        Route::get('/assistants/{id}', [AssistantController::class, 'show']);
        Route::put('/assistants/{id}', [AssistantController::class, 'update']);
        Route::delete('/assistants/{id}', [AssistantController::class, 'destroy']);

        Route::get('/patients/{patient}/ordonnances', [OrdonnanceController::class, 'index']);
        Route::post('/patients/{patient}/ordonnances', [OrdonnanceController::class, 'store']);
        Route::delete('/ordonnances/{ordonnance}', [OrdonnanceController::class, 'destroy']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/lues', [NotificationController::class, 'marquerLues']);
    });
});