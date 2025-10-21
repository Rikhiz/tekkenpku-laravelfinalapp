<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leaderboard;
use App\Models\User;
use App\Models\RelasiTour;
use App\Models\Tournament;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminLeaderboardController extends Controller
{
    /**
     * Display a listing of the leaderboard.
     */
    public function index()
    {
        $leaderboardAll = Leaderboard::with('user')
            ->orderBy('total_points', 'desc')
            ->get();

        return Inertia::render('Admin/Leaderboard/Index', [
            'leaderboardAll' => $leaderboardAll,
            'authUser' => auth()->user()
        ]);
    }

    /**
     * Recalculate leaderboard from relasitour data
     */
    public function recalculate()
    {
        try {
            DB::beginTransaction();

            // Get all tournament results from relasitour with tournament data
            // Exclude user with sgguserid 4747588 (TomBebyLand)
            $results = RelasiTour::with(['user', 'tournament'])
                ->whereHas('tournament')
                ->whereHas('user', function ($query) {
                    $query->where('sgguserid', '!=', 4747588);
                })
                ->get();

            if ($results->isEmpty()) {
                return back()->with('error', 'No tournament results found in relasitour table.');
            }

            // Group results by user
            $participantResults = [];

            foreach ($results as $result) {
                $user = $result->user;
                $tournament = $result->tournament;

                if (!$user || !$tournament)
                    continue;

                // Double check: skip if sgguserid is 4747588
                if ($user->sgguserid == 4747588)
                    continue;

                $userId = $user->id;
                $playerName = $user->name;
                $placement = (int) $result->placement;
                $entrants = (int) $tournament->total;
                $category = (int) $tournament->category;

                // Calculate points based on placement and category
                $points = $this->calculatePoints($placement, $entrants, $category);

                if (!isset($participantResults[$userId])) {
                    $participantResults[$userId] = [
                        'user_id' => $userId,
                        'player_name' => $playerName,
                        'majorEvents' => [],
                        'minorEvents' => [],
                        'miniEvents' => [],
                    ];
                }

                $eventData = [
                    'tournament_id' => $tournament->tourid,
                    'tournament_name' => $tournament->name,
                    'placement' => $placement,
                    'points' => $points,
                    'entrants' => $entrants,
                    'category' => $category,
                    'start_date' => $tournament->start_date,
                ];

                // Categorize events
                if ($category === 1) {
                    $participantResults[$userId]['majorEvents'][] = $eventData;
                } elseif ($category === 2) {
                    $participantResults[$userId]['minorEvents'][] = $eventData;
                } elseif ($category === 3) {
                    $participantResults[$userId]['miniEvents'][] = $eventData;
                }
            }

            // Calculate final scores and update leaderboard
            $leaderboardData = [];

            foreach ($participantResults as $userId => $data) {
                // Sort events by points (descending)
                $sortedMajor = collect($data['majorEvents'])->sortByDesc('points')->values()->all();
                $sortedMinor = collect($data['minorEvents'])->sortByDesc('points')->values()->all();
                $sortedMini = collect($data['miniEvents'])->sortByDesc('points')->values()->all();

                // Take top events according to rules
                $countedMajorEvents = array_slice($sortedMajor, 0, 1);
                $countedMinorEvents = array_slice($sortedMinor, 0, 2);
                $countedMiniEvents = array_slice($sortedMini, 0, 4);

                // Calculate points
                $majorPoints = array_sum(array_column($countedMajorEvents, 'points'));
                $minorPoints = array_sum(array_column($countedMinorEvents, 'points'));
                $miniPoints = array_sum(array_column($countedMiniEvents, 'points'));
                $totalPoints = $majorPoints + $minorPoints + $miniPoints;

                $leaderboardData[] = [
                    'user_id' => $userId,
                    'player_name' => $data['player_name'],
                    'major' => $majorPoints,
                    'minor' => $minorPoints,
                    'mini' => $miniPoints,
                    'total_points' => $totalPoints,
                    'counted_major_events' => count($countedMajorEvents),
                    'counted_minor_events' => count($countedMinorEvents),
                    'counted_mini_events' => count($countedMiniEvents),
                    'total_major_events' => count($sortedMajor),
                    'total_minor_events' => count($sortedMinor),
                    'total_mini_events' => count($sortedMini),
                ];
            }

            // Clear existing leaderboard and insert new data
            Leaderboard::truncate();

            foreach ($leaderboardData as $entry) {
                Leaderboard::create($entry);
            }

            DB::commit();

            return back()->with('success', 'Leaderboard recalculated successfully! Updated ' . count($leaderboardData) . ' players.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Leaderboard recalculation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to recalculate leaderboard: ' . $e->getMessage());
        }
    }

    /**
     * Calculate points based on placement, entrants, and category
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

    /**
     * Show the form for creating a new leaderboard entry.
     */
    public function create()
    {
        return Inertia::render('Admin/Leaderboard/Create', [
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created leaderboard entry.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'player_name' => 'required|string|max:255',
            'major' => 'nullable|integer',
            'minor' => 'nullable|integer',
            'mini' => 'nullable|integer',
            'total_points' => 'nullable|integer',
            'counted_major_events' => 'nullable|integer',
            'counted_minor_events' => 'nullable|integer',
            'counted_mini_events' => 'nullable|integer',
            'total_major_events' => 'nullable|integer',
            'total_minor_events' => 'nullable|integer',
            'total_mini_events' => 'nullable|integer',
        ]);

        Leaderboard::create($request->all());

        return redirect()->route('admin.leaderboard.index')
            ->with('success', 'Leaderboard entry created successfully.');
    }

    /**
     * Display the specified leaderboard entry.
     */
    public function show(Leaderboard $leaderboard)
    {
        return Inertia::render('Admin/Leaderboard/Show', [
            'leaderboard' => $leaderboard->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified leaderboard entry.
     */
    public function edit(Leaderboard $leaderboard)
    {
        return Inertia::render('Admin/Leaderboard/Edit', [
            'leaderboard' => $leaderboard,
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified leaderboard entry.
     */
    public function update(Request $request, Leaderboard $leaderboard)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'player_name' => 'required|string|max:255',
            'major' => 'nullable|integer',
            'minor' => 'nullable|integer',
            'mini' => 'nullable|integer',
            'total_points' => 'nullable|integer',
            'counted_major_events' => 'nullable|integer',
            'counted_minor_events' => 'nullable|integer',
            'counted_mini_events' => 'nullable|integer',
            'total_major_events' => 'nullable|integer',
            'total_minor_events' => 'nullable|integer',
            'total_mini_events' => 'nullable|integer',
        ]);

        $leaderboard->update($request->all());

        return redirect()->route('admin.leaderboard.index')
            ->with('success', 'Leaderboard entry updated successfully.');
    }

    /**
     * Remove the specified leaderboard entry.
     */
    public function destroy(Leaderboard $leaderboard)
    {
        $leaderboard->delete();

        return redirect()->route('admin.leaderboard.index')
            ->with('success', 'Leaderboard entry deleted successfully.');
    }
}