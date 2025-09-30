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

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\TournamentsController;

Route::get('/', [WelcomeController::class, 'index']);
Route::get('/tournaments', [TournamentsController::class, 'index'])->name('tournaments.index');
Route::get('/tournaments/{id}', [TournamentsController::class, 'show'])->name('tournaments.show');

Route::prefix('admin')->middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Users
    Route::post('users/sync-all', [AdminUsersController::class, 'syncAllPlayers'])->name('users.syncAll');
    Route::post('users/sync-participants', [AdminUsersController::class, 'syncParticipants'])->name('users.syncParticipants');
    
    // Participants
    Route::prefix('participants')->name('participants.')->group(function () {
        // Main participants page - shows tournament list
        Route::get('/', [AdminParticipantController::class, 'index'])->name('index');
        
        // Show participants for specific tournament
        Route::get('/tournament/{tournament}', [AdminParticipantController::class, 'showTournament'])->name('tournament');
        
        // CRUD operations
        Route::post('/store', [AdminParticipantController::class, 'store'])->name('store');
        Route::put('/{participant}', [AdminParticipantController::class, 'update'])->name('update');
        Route::delete('/{participant}', [AdminParticipantController::class, 'destroy'])->name('destroy');
        
        // Sync operations
        Route::post('/sync', [AdminParticipantController::class, 'syncParticipants'])->name('sync');
        Route::post('/sync/{tournament}', [AdminParticipantController::class, 'syncTournamentParticipants'])->name('sync.tournament');
        
        // Bulk operations
        Route::post('/bulk-action', [AdminParticipantController::class, 'bulkAction'])->name('bulk');
        
        // Export
        Route::get('/export', [AdminParticipantController::class, 'export'])->name('export');
        
        // Stats API
        Route::get('/stats', [AdminParticipantController::class, 'getTournamentStats'])->name('stats');
    });
    
    // Leaderboard - Add recalculate route before resource
    Route::post('leaderboard/recalculate', [AdminLeaderboardController::class, 'recalculate'])->name('leaderboard.recalculate');
    
    // Resource routes
    Route::resource('gallery', AdminGalleriesController::class);
    Route::resource('users', AdminUsersController::class);
    Route::resource('tournaments', AdminTournamentsController::class);
    Route::resource('startgg', AdminStartGGController::class);
    Route::resource('leaderboard', AdminLeaderboardController::class);
    Route::resource('participant', AdminParticipantController::class);
});

Route::fallback(function () {
    return Inertia::render('Errors/NotFound', [
        'status' => 404,
    ]);
});

require __DIR__ . '/auth.php';