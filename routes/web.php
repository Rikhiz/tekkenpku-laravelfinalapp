<?php

use App\Http\Controllers\Admin\AdminActivityController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGalleriesController;
use App\Http\Controllers\Admin\AdminLeaderboardController;
use App\Http\Controllers\Admin\AdminParticipantController;
use App\Http\Controllers\Admin\AdminStartGGController;
use App\Http\Controllers\Admin\AdminTournamentsController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\AdminBanListController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\GalleryController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ActivityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\TournamentsController;

Route::get('/', [WelcomeController::class, 'index']);
Route::get('/tournaments', [TournamentsController::class, 'index'])->name('tournaments.index');
Route::get('/tournaments/{tournament}', [TournamentsController::class, 'show'])->name('tournaments.show');
Route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
Route::get('/activity/{activity}', [ActivityController::class, 'show'])->name('activity.show');

// web.php
Route::get('/about', [AboutController::class, 'index'])->name('about');


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
    Route::resource('activity', AdminActivityController::class);
    Route::resource('banlist', AdminBanListController::class);

});

// routes/web.php



Route::get('/leaderboards', [LeaderboardController::class, 'index'])->name('leaderboards.index');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');

// OAuth Routes
Route::prefix('oauth')->name('oauth.')->group(function () {
    Route::get('/redirect', [App\Http\Controllers\Auth\StartGGOAuthController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [App\Http\Controllers\Auth\StartGGOAuthController::class, 'callback'])->name('callback');
});
Route::get('/profile', function () {
    return Inertia::render('Profile', [
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->middleware(['auth'])->name('profile');

Route::fallback(function () {
    return Inertia::render('Errors/NotFound', [
        'status' => 404,
    ]);
});

require __DIR__ . '/auth.php';