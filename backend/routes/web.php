<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Authenticate broadcasting auth endpoint via Sanctum
Broadcast::routes(['middleware' => ['auth:sanctum']]);
