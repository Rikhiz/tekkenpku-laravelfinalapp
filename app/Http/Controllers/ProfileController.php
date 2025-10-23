<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\RelasiTour;
use Illuminate\Support\Facades\Log;
use App\Models\Leaderboard;

class ProfileController extends Controller
{
    /**
     * Display the user's profile with tournament history
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        // 🔹 Log ID user yang sedang login
        Log::info('User sedang mengakses profil', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
        ]);

        // Get user's tournament history with tournament details
        $tournaments = RelasiTour::with(['tournament'])
            ->where('user_id', $user->id)
            ->whereHas('tournament')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($relasi) {
                $tournament = $relasi->tournament;

                // Category mapping
                $categoryMap = [
                    1 => ['name' => 'Major', 'color' => 'text-red-400', 'bg' => 'bg-red-400/10'],
                    2 => ['name' => 'Minor', 'color' => 'text-blue-400', 'bg' => 'bg-blue-400/10'],
                    3 => ['name' => 'Mini', 'color' => 'text-green-400', 'bg' => 'bg-green-400/10'],
                ];

                $category = $categoryMap[$tournament->category] ?? ['name' => 'Unknown', 'color' => 'text-gray-400', 'bg' => 'bg-gray-400/10'];

                // Status mapping
                $statusColor = $tournament->status === 'Pendaftaran Dibuka'
                    ? 'bg-[#F2AF29]/20 text-[#F2AF29] border-[#F2AF29]/30'
                    : 'bg-[#69747C]/20 text-[#69747C] border-[#69747C]/30';

                return [
                    'id' => $tournament->tourid,
                    'url_startgg' => $tournament->url_startgg,
                    'name' => $tournament->name,
                    'description' => $tournament->desc,
                    'image_url' => $tournament->image_url,
                    'start_date' => $tournament->start_date,
                    'end_date' => $tournament->end_date,
                    'status' => $tournament->status,
                    'status_color' => $statusColor,
                    'category' => $tournament->category,
                    'category_name' => $category['name'],
                    'category_color' => $category['color'],
                    'category_bg' => $category['bg'],
                    'placement' => $relasi->placement,
                    'prize_pool' => $tournament->prizepool,
                    'participants_count' => $tournament->relasi()->count(),
                ];
            });

        $leaderboardStats = Leaderboard::where('user_id', $user->id)->first();

        // Jika tidak ada (misal user admin atau belum punya data leaderboard), buat data default
        if (!$leaderboardStats) {
            $leaderboardStats = (object) [
                'total_points' => 0,
                'major' => 0,
                'minor' => 0,
                'mini' => 0,
                'total_major_events' => 0,
                'total_minor_events' => 0,
                'total_mini_events' => 0,
                'player_name' => $user->name,
            ];
        }

        // Hitung rank user (berdasarkan total_points)
        $rank = Leaderboard::where('total_points', '>', $leaderboardStats->total_points)->count() + 1;





        // Calculate statistics
        $stats = [
            'total_tournaments' => $tournaments->count(),
            'total_wins' => $tournaments->where('placement', 1)->count(),
            'podium_finishes' => $tournaments->where('placement', '<=', 3)->count(),
            'average_placement' => $tournaments->where('placement', '!=', null)->avg('placement'),
            'major_events' => $tournaments->where('category', 1)->count(),
            'minor_events' => $tournaments->where('category', 2)->count(),
            'mini_events' => $tournaments->where('category', 3)->count(),
        ];

        // Kirim ke view
        return Inertia::render('Profile/Index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'tournaments' => $tournaments,
            'stats' => $stats,
            'leaderboardStats' => [
                'total_points' => $leaderboardStats->total_points,
                'major' => $leaderboardStats->major,
                'minor' => $leaderboardStats->minor,
                'mini' => $leaderboardStats->mini,
                'total_major_events' => $leaderboardStats->total_major_events,
                'total_minor_events' => $leaderboardStats->total_minor_events,
                'total_mini_events' => $leaderboardStats->total_mini_events,
                'rank' => $rank,
            ],
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.index');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}