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
        $totalTournaments = Tournament::count();

        // Get leaderboard data with pagination, ordered by total_points descending
        $leaderboards = Leaderboard::with(['user', 'user.relasi.tournament'])
            ->orderBy('total_points', 'desc')
            ->paginate($perPage);

        // Add rank and tournament history to each item
        $leaderboards->getCollection()->transform(function ($item, $key) use ($leaderboards) {
            $item->rank = ($leaderboards->currentPage() - 1) * $leaderboards->perPage() + $key + 1;

            // Get tournament history with placement and tournament details
            if ($item->user) {
                $tournaments = RelasiTour::where('user_id', $item->user_id)
                    ->with([
                        'tournament' => function ($query) {
                            $query->select('tourid', 'name', 'category', 'total', 'start_date', 'url_startgg');
                        }
                    ])
                    ->whereHas('tournament')
                    ->orderBy('placement', 'asc')
                    ->get()
                    ->map(function ($relasi) {
                        if (!$relasi->tournament)
                            return null;

                        $placement = (int) $relasi->placement;
                        $entrants = (int) $relasi->tournament->total;
                        $category = (int) $relasi->tournament->category;

                        // Calculate points using the same logic as AdminLeaderboardController
                        $points = $this->calculatePoints($placement, $entrants, $category);

                        return [
                            'tournament_id' => $relasi->tournament->tourid,
                            'tournament_name' => $relasi->tournament->name,
                            'url_startgg' => $relasi->tournament->url_startgg,
                            'placement' => $placement,
                            'points' => $points,
                            'entrants' => $relasi->tournament->max_pemain,
                            'category' => $category,
                            'start_date' => $relasi->tournament->start_date,
                        ];
                    })
                    ->filter()
                    ->values();

                $item->tournaments = $tournaments;
            }

            return $item;
        });

        $mostOverPlacement = RelasiTour::mostFrequentPlacement(8)
            ->with('user') // ambil relasi user biar bisa diakses di React
            ->limit(1)
            ->first();

        $mostOverPlacement4 = RelasiTour::mostFrequentPlacement(4)
            ->with('user') // ambil relasi user biar bisa diakses di React
            ->limit(1)
            ->first();

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

    /**
     * Calculate points based on placement, entrants, and category
     * Same logic as AdminLeaderboardController
     */
    private function calculatePoints($placement, $entrants, $category)
    {
        $pointTable = [
            1 => [ // Major Events
                1 => 800,
                2 => 560,
                3 => 430,
                4 => 220,
                5 => 150,
                7 => 120,
                9 => 70,
                13 => 50,
                17 => 30
            ],
            2 => [ // Minor Events
                1 => 400,
                2 => 300,
                3 => 220,
                4 => 150,
                5 => 70,
                7 => 50,
                9 => 30,
                13 => 15,
                17 => 10
            ],
            3 => [ // Mini Events
                1 => 220,
                2 => 150,
                3 => 100,
                4 => 70,
                5 => 50,
                7 => 30,
                9 => 15,
                13 => 10,
                17 => 5
            ]
        ];

        if (!isset($pointTable[$category])) {
            return 0;
        }

        $categoryPoints = $pointTable[$category];

        // Determine point value based on placement ranges
        if ($placement === 1)
            return $categoryPoints[1];
        if ($placement === 2)
            return $categoryPoints[2];
        if ($placement === 3)
            return $categoryPoints[3];
        if ($placement === 4)
            return $categoryPoints[4];
        if ($placement >= 5 && $placement <= 6)
            return $categoryPoints[5];
        if ($placement >= 7 && $placement <= 8)
            return $categoryPoints[7];
        if ($placement >= 9 && $placement <= 12)
            return $categoryPoints[9];
        if ($placement >= 13 && $placement <= 16)
            return $categoryPoints[13];
        if ($placement >= 17)
            return $categoryPoints[17];

        return 0;
    }
}