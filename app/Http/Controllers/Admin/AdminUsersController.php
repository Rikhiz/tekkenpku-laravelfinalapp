<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Tournament;
use App\Models\RelasiTour;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AdminUsersController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'sgguserid', 'role', 'created_at')
            ->latest()
            ->get();

        return Inertia::render('Admin/Users/Index', [
            'usersall' => $users,
            'users' => User::select('id', 'name')->get(),
            'authUser' => auth()->user(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'authUser' => auth()->user(),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'authUser' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'sgguserid' => 'nullable|integer|unique:users,sgguserid',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,player',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'sgguserid' => $request->sgguserid,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'sgguserid' => 'nullable|integer|unique:users,sgguserid,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,player',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'sgguserid' => $request->sgguserid,
            'role' => $request->role,
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }

    /**
     * Sync all players from all tournaments using GraphQL
     */
    public function syncAllPlayers()
    {
        $tournaments = Tournament::whereNotNull('url_startgg')->get();
        $syncedCount = 0;
        $errorCount = 0;
        $apiKey = env('STARTGG_API_KEY');
        $videogameId = env('tekken_id');

        if (!$apiKey) {
            return back()->with('error', 'Start.gg API key tidak ditemukan di environment.');
        }

        // 🔥 Hapus semua user dengan role 'player' terlebih dahulu
        // (foreign key cascade akan otomatis hapus di relasi_tour)
        $deletedPlayers = User::where('role', 'player')->delete();

        foreach ($tournaments as $tournament) {
            try {
                $query = <<<'GRAPHQL'
            query GetTournamentData($tourneySlug: String!, $videogameId: [ID]!, $page: Int!, $perPage: Int!) {
                allEvents: tournament(slug: $tourneySlug) {
                    id
                    name
                    events {
                        id
                        name
                        standings(query: { perPage: $perPage, page: $page }) {
                            nodes {
                                entrant {
                                    id
                                    name
                                    participants {
                                        id
                                        player {
                                            id
                                            gamerTag
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                tekkenEvents: tournament(slug: $tourneySlug) {
                    id
                    name
                    events(filter: { videogameId: $videogameId }) {
                        id
                        name
                    }
                }
            }
            GRAPHQL;

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post('https://api.start.gg/gql/alpha', [
                            'query' => $query,
                            'variables' => [
                                'tourneySlug' => $tournament->url_startgg,
                                'videogameId' => [(int) $videogameId],
                                'page' => 1,
                                'perPage' => 500,
                            ],
                        ]);

                if ($response->failed()) {
                    $errorCount++;
                    continue;
                }

                $data = $response->json();

                if (!isset($data['data']['allEvents'])) {
                    $errorCount++;
                    continue;
                }

                $events = $data['data']['allEvents']['events'] ?? [];

                foreach ($events as $event) {
                    $standings = $event['standings']['nodes'] ?? [];

                    foreach ($standings as $standing) {
                        $entrant = $standing['entrant'];
                        $participants = $entrant['participants'] ?? [];

                        foreach ($participants as $participant) {
                            if (isset($participant['player']['id'])) {
                                $playerId = $participant['player']['id'];
                                $gamerTag = $participant['player']['gamerTag'];

                                $existingUser = User::where('sgguserid', $playerId)->first();

                                if (!$existingUser) {
                                    User::create([
                                        'name' => $gamerTag ?? 'Unknown Player',
                                        'sgguserid' => $playerId,
                                        'role' => 'player',
                                        'email' => null,
                                        'password' => null,
                                    ]);
                                    $syncedCount++;
                                }
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                $errorCount++;
                continue;
            }
        }

        $message = "Sinkronisasi selesai. Semua data player lama dihapus ({$deletedPlayers} user dihapus). {$syncedCount} player baru berhasil ditambahkan.";
        if ($errorCount > 0) {
            $message .= " {$errorCount} tournament gagal diproses.";
        }

        return back()->with('success', $message);
    }
    /**
     * Sync participants for all tournaments
     */
    public function syncParticipants()
    {
        $tournaments = Tournament::whereNotNull('url_startgg')
            ->whereNotNull('sggid')
            ->get();
        $syncedCount = 0;
        $errorCount = 0;
        $apiKey = env('STARTGG_API_KEY');

        if (!$apiKey) {
            return back()->with('error', 'Start.gg API key tidak ditemukan di environment.');
        }

        foreach ($tournaments as $tournament) {
            try {
                $query = <<<'GRAPHQL'
                    query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
                    event(id: $eventId) {
                        id
                        name
                        standings(query: {
                        perPage: $perPage,
                        page: $page
                        }) {
                        nodes {
                            placement
                            entrant {
                            id
                            name
                            participants {
                                id
                                gamerTag
                                user {
                                id
                                name
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                    GRAPHQL;

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post('https://api.start.gg/gql/alpha', [
                            'query' => $query,
                            'variables' => [
                                'eventId' => $tournament->sggid,
                                'page' => 1,
                                'perPage' => 500,
                            ],
                        ]);

                if ($response->failed()) {
                    $errorCount++;
                    continue;
                }

                $data = $response->json();

                if (!isset($data['data']['event']['standings']['nodes'])) {
                    $errorCount++;
                    continue;
                }

                $standings = $data['data']['event']['standings']['nodes'];

                foreach ($standings as $standing) {
                    $placement = $standing['placement'];
                    $participants = $standing['entrant']['participants'] ?? [];

                    foreach ($participants as $participant) {
                        if (isset($participant['user']['id'])) {
                            // Cari user berdasarkan sgguserid
                            $user = User::where('sgguserid', $participant['user']['id'])->first();

                            if ($user) {
                                // Cek apakah relasi sudah ada
                                $existingRelation = RelasiTour::where('user_id', $user->id)
                                    ->where('tourid', $tournament->tourid)
                                    ->first();

                                if (!$existingRelation) {
                                    RelasiTour::create([
                                        'user_id' => $user->id,
                                        'tourid' => $tournament->tourid,
                                        'placement' => $placement,
                                    ]);
                                    $syncedCount++;
                                } else {
                                    // Update placement jika sudah ada
                                    $existingRelation->update(['placement' => $placement]);
                                }
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                $errorCount++;
                continue;
            }
        }

        $message = "Sinkronisasi participants selesai. {$syncedCount} relasi berhasil ditambahkan/diupdate.";
        if ($errorCount > 0) {
            $message .= " {$errorCount} tournament gagal diproses.";
        }

        return back()->with('success', $message);
    }
}
