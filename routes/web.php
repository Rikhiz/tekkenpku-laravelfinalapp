<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGalleriesController;
use App\Http\Controllers\Admin\AdminLeaderboardController;
use App\Http\Controllers\Admin\AdminParticipantController;
use App\Http\Controllers\Admin\AdminStartGGController;
use App\Http\Controllers\Admin\AdminTournamentsController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\ProfileController;
use App\Models\Leaderboard;
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
    // route
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('/users/sync-all', [AdminStartGGController::class, 'syncAllPlayers'])->name('admin.users.sync');
    // Resource 
    Route::resource('gallery', AdminGalleriesController::class);
    Route::resource('users', AdminUsersController::class);
    Route::resource('tournaments', AdminTournamentsController::class);
    Route::resource('startgg', AdminStartGGController::class);
    Route::resource('leaderboard',AdminLeaderboardController::class);
    Route::resource('participant',AdminParticipantController::class);
});

require __DIR__ . '/auth.php';