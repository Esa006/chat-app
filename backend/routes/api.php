<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ── Public Auth Routes ──────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Protected Routes ────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Users
    Route::get('/users', [UserController::class, 'index']);

    // Conversations
    Route::get('/conversations',       [ConversationController::class, 'index']);
    Route::post('/conversations',      [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);

    // Messages
    Route::get('/conversations/{conversation}/messages',  [MessageController::class, 'index']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('/conversations/{conversation}/read',     [MessageController::class, 'markRead']);
});
