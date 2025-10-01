<?php

namespace App\Http\Controllers;

use App\Models\Leaderboard;
use App\Models\Tournament;
use App\Models\RelasiTour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 32;
        $totalTournaments = Tournament::count();    // total turnamen
        // Get leaderboard data with pagination, ordered by total_points descending
        $leaderboards = Leaderboard::with('user')
            ->orderBy('total_points', 'desc')
            ->paginate($perPage);
        
        // Add rank to each item
        $leaderboards->getCollection()->transform(function ($item, $key) use ($leaderboards) {
            $item->rank = ($leaderboards->currentPage() - 1) * $leaderboards->perPage() + $key + 1;
            return $item;
        });
        $mostOverPlacement = RelasiTour::mostOverPlacement(1,8)->first();
        $mostOverPlacement4 = RelasiTour::mostOverPlacement(1,4)->first();
        // Get max points for chart scaling
        $maxPoints = Leaderboard::max('total_points') ?? 100;
        
        return Inertia::render('Leaderboard/Index', [
            'leaderboards' => $leaderboards,
            'maxPoints' => $maxPoints,
            'mostover8' => $mostOverPlacement,
            'mostover4' => $mostOverPlacement4,
            'tourtotal' => $totalTournaments,
        ]);
    }
}