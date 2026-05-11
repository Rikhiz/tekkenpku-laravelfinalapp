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
    public function index(Request $request)
    {
        $availableSeasons = Tournament::whereNotNull('season')
            ->distinct()
            ->pluck('season')
            ->sort()
            ->values();

        $selectedSeason = (int) $request->input('season', $availableSeasons->last());

        $leaderboardAll = Leaderboard::with('user')
            ->where('season', $selectedSeason)
            ->orderBy('total_points', 'desc')
            ->get();

        return Inertia::render('Admin/Leaderboard/Index', [
            'leaderboardAll' => $leaderboardAll,
            'authUser' => auth()->user(),
            'availableSeasons' => $availableSeasons,
            'selectedSeason' => $selectedSeason
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
                    $query->where(function($q) {
                        $q->where('sgguserid', '!=', 4747588)
                          ->orWhereNull('sgguserid');
                    });
                })
                ->get();

            if ($results->isEmpty()) {
                return back()->with('error', 'No tournament results found in relasitour table.');
            }

            // Group results by season and user
            $participantResults = []; // [season => [userId => [data]]]

            foreach ($results as $result) {
                $user = $result->user;
                $tournament = $result->tournament;

                if (!$user || !$tournament)
                    continue;

                // Double check: skip if sgguserid is 4747588
                if ($user->sgguserid == 4747588)
                    continue;

                $season = (int) $tournament->season;
                // If a tournament has no season configured somehow, we can put it in season 1 or skip it.
                // It's safer to skip or default to 1. Defaulting to 1.
                if (!$season) $season = 1;

                $userId = $user->id;
                $playerName = $user->name;
                $placement = (int) $result->placement;
                $entrants = (int) $tournament->total;
                $category = (int) $tournament->category;

                // Calculate points based on placement and category
                $points = $this->calculatePoints($placement, $entrants, $category);

                if (!isset($participantResults[$season][$userId])) {
                    $participantResults[$season][$userId] = [
                        'user_id' => $userId,
                        'player_name' => $playerName,
                        'finalsEvents' => [],
                        'primeEvents' => [],
                        'coreEvents' => [],
                        'bitEvents' => [],
                        'scoutEvents' => [],
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
                    $participantResults[$season][$userId]['finalsEvents'][] = $eventData;
                } elseif ($category === 2) {
                    $participantResults[$season][$userId]['primeEvents'][] = $eventData;
                } elseif ($category === 3) {
                    $participantResults[$season][$userId]['coreEvents'][] = $eventData;
                } elseif ($category === 4) {
                    $participantResults[$season][$userId]['bitEvents'][] = $eventData;
                } elseif ($category === 5) {
                    $participantResults[$season][$userId]['scoutEvents'][] = $eventData;
                }
            }

            // Calculate final scores and update leaderboard
            $leaderboardData = [];

            foreach ($participantResults as $season => $usersData) {
                foreach ($usersData as $userId => $data) {
                    // Sort events by points (descending)
                    $sortedFinals = collect($data['finalsEvents'] ?? [])->sortByDesc('points')->values()->all();
                    $sortedPrime = collect($data['primeEvents'] ?? [])->sortByDesc('points')->values()->all();
                    $sortedCore = collect($data['coreEvents'] ?? [])->sortByDesc('points')->values()->all();
                    $sortedBit = collect($data['bitEvents'] ?? [])->sortByDesc('points')->values()->all();
                    $sortedScout = collect($data['scoutEvents'] ?? [])->sortByDesc('points')->values()->all();

                    // Take top events according to rules
                    // Finals=1, Prime=1, Core=2, Bit=3, Scout=4
                    $countedFinalsEvents = array_slice($sortedFinals, 0, 1);
                    $countedPrimeEvents = array_slice($sortedPrime, 0, 1);
                    $countedCoreEvents = array_slice($sortedCore, 0, 2);
                    $countedBitEvents = array_slice($sortedBit, 0, 3);
                    $countedScoutEvents = array_slice($sortedScout, 0, 4);

                    // Calculate points
                    $finalsPoints = array_sum(array_column($countedFinalsEvents, 'points'));
                    $primePoints = array_sum(array_column($countedPrimeEvents, 'points'));
                    $corePoints = array_sum(array_column($countedCoreEvents, 'points'));
                    $bitPoints = array_sum(array_column($countedBitEvents, 'points'));
                    $scoutPoints = array_sum(array_column($countedScoutEvents, 'points'));
                    $totalPoints = $primePoints + $corePoints + $bitPoints;

                    $leaderboardData[] = [
                        'user_id' => $userId,
                        'season' => $season,
                    'player_name' => $data['player_name'],
                    'finals' => $finalsPoints,
                    'prime' => $primePoints,
                    'core' => $corePoints,
                    'bit' => $bitPoints,
                    'scout' => $scoutPoints,
                    'total_points' => $totalPoints,
                    'counted_finals_events' => count($countedFinalsEvents),
                    'counted_prime_events' => count($countedPrimeEvents),
                    'counted_core_events' => count($countedCoreEvents),
                    'counted_bit_events' => count($countedBitEvents),
                    'counted_scout_events' => count($countedScoutEvents),
                    'total_finals_events' => count($sortedFinals),
                    'total_prime_events' => count($sortedPrime),
                    'total_core_events' => count($sortedCore),
                    'total_bit_events' => count($sortedBit),
                        'total_scout_events' => count($sortedScout),
                    ];
                }
            }

            // 🔒 Cari season mana saja yang memiliki turnamen kategori Finals (category = 1)
            $lockedSeasons = \App\Models\Tournament::where('category', 1)
                ->pluck('season')
                ->filter()
                ->unique()
                ->toArray();

            // Hapus data leaderboard lama HANYA untuk season yang TIDAK dilock
            if (!empty($lockedSeasons)) {
                Leaderboard::whereNotIn('season', $lockedSeasons)->delete();
            } else {
                Leaderboard::truncate(); // Jika tidak ada yang dilock, aman untuk truncate
            }

            $insertedCount = 0;
            $skippedSeasons = [];

            foreach ($leaderboardData as $entry) {
                // Jangan timpa data untuk season yang dilock
                if (in_array($entry['season'], $lockedSeasons)) {
                    if (!in_array($entry['season'], $skippedSeasons)) {
                        $skippedSeasons[] = $entry['season'];
                    }
                    continue;
                }

                Leaderboard::create($entry);
                $insertedCount++;
            }

            DB::commit();

            $msg = 'Leaderboard recalculated successfully! Updated ' . $insertedCount . ' players.';
            if (!empty($skippedSeasons)) {
                $msg .= ' (Season ' . implode(', ', $skippedSeasons) . ' locked because Finals exist)';
            }

            return back()->with('success', $msg);

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
            1 => [ // Finals - as requested, Finals generate 0 points
                1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0, 7 => 0, 9 => 0, 13 => 0, 17 => 0
            ],
            2 => [ // Prime (Old Major)
                1 => 800, 2 => 560, 3 => 430, 4 => 220, 5 => 150, 7 => 120, 9 => 70, 13 => 50, 17 => 30
            ],
            3 => [ // Core (Old Minor)
                1 => 400, 2 => 300, 3 => 220, 4 => 150, 5 => 70, 7 => 50, 9 => 30, 13 => 15, 17 => 10
            ],
            4 => [ // Bit (Old Mini)
                1 => 220, 2 => 150, 3 => 100, 4 => 70, 5 => 50, 7 => 30, 9 => 15, 13 => 10, 17 => 5
            ],
            5 => [ // Scout
                1 => 150, 2 => 100, 3 => 70, 4 => 50, 5 => 30, 7 => 15, 9 => 10, 13 => 5, 17 => 2
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
            'finals' => 'nullable|integer',
            'prime' => 'nullable|integer',
            'core' => 'nullable|integer',
            'bit' => 'nullable|integer',
            'scout' => 'nullable|integer',
            'total_points' => 'nullable|integer',
            'counted_finals_events' => 'nullable|integer',
            'counted_prime_events' => 'nullable|integer',
            'counted_core_events' => 'nullable|integer',
            'counted_bit_events' => 'nullable|integer',
            'counted_scout_events' => 'nullable|integer',
            'total_finals_events' => 'nullable|integer',
            'total_prime_events' => 'nullable|integer',
            'total_core_events' => 'nullable|integer',
            'total_bit_events' => 'nullable|integer',
            'total_scout_events' => 'nullable|integer',
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
            'finals' => 'nullable|integer',
            'prime' => 'nullable|integer',
            'core' => 'nullable|integer',
            'bit' => 'nullable|integer',
            'scout' => 'nullable|integer',
            'total_points' => 'nullable|integer',
            'counted_finals_events' => 'nullable|integer',
            'counted_prime_events' => 'nullable|integer',
            'counted_core_events' => 'nullable|integer',
            'counted_bit_events' => 'nullable|integer',
            'counted_scout_events' => 'nullable|integer',
            'total_finals_events' => 'nullable|integer',
            'total_prime_events' => 'nullable|integer',
            'total_core_events' => 'nullable|integer',
            'total_bit_events' => 'nullable|integer',
            'total_scout_events' => 'nullable|integer',
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