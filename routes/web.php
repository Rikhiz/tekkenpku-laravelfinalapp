<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGalleriesController;
use App\Http\Controllers\Admin\AdminStartGGController;
use App\Http\Controllers\Admin\AdminTournamentsController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('admin')->middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    // Dashboard route
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Resource routes (ini sudah include GET /admin/tournaments)
    Route::resource('gallery', AdminGalleriesController::class);
    Route::resource('users', AdminUsersController::class);
    Route::resource('tournaments', AdminTournamentsController::class);
    Route::resource('startgg', AdminStartGGController::class);
});

require __DIR__ . '/auth.php';