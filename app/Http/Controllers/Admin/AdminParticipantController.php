<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RelasiTour;
use App\Models\User;
use App\Models\Tournament;
use Illuminate\Support\Facades\Http;

class AdminParticipantController extends Controller
{
    /**
     * Display tournament list and participants overview.
     */
   public function index(Request $request)
{
    $participantsAll = RelasiTour::with(['user', 'tournament'])->latest()->get();
    $tournaments = Tournament::select('tourid', 'name', 'category')->orderBy('name')->get();

    $selectedTournament = null;
    if ($request->has('tournament')) {
        $selectedTournament = Tournament::where('tourid', $request->get('tournament'))->first();
    }

    return Inertia::render('Admin/Participants/Index', [
        'participantsAll'     => $participantsAll,
        'authUser'            => auth()->user(),
        'users'               => User::select('id', 'name', 'sgguserid')->orderBy('name')->get(),
        'tournaments'         => $tournaments,
        'selectedTournament'  => $selectedTournament,
    ]);
}



    /**
     * Display participants for a specific tournament.
     */
    public function showTournament(Tournament $tournament)
    {
        $participantsAll = RelasiTour::with(['user', 'tournament'])->latest()->get();
        
        return Inertia::render('Admin/Participants/Index', [
            'participantsAll' => $participantsAll,
            'authUser' => auth()->user(),
            'users' => User::select('id', 'name', 'sgguserid')->orderBy('name')->get(),
            'tournaments' => Tournament::select('tourid', 'name', 'category')
                                      ->orderBy('name')
                                      ->get(),
            'selectedTournament' => $tournament,
        ]);
    }

    /**
     * Store a newly created participant in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tourid'  => 'required|exists:tournaments,tourid',
            'placement' => 'nullable|integer|min:1',
        ]);

        // Check if participant already exists
        $existing = RelasiTour::where('user_id', $request->user_id)
                              ->where('tourid', $request->tourid)
                              ->first();

        if ($existing) {
            return back()->withErrors([
                'user_id' => 'Participant sudah terdaftar untuk tournament ini.'
            ]);
        }

        RelasiTour::create($request->all());

        $tournament = Tournament::where('tourid', $request->tourid)->first();
        $message = 'Participant berhasil ditambahkan';
        
        if ($tournament) {
            $message .= ' ke tournament "' . $tournament->name . '"';
        }
        $message .= '.';

        return back()->with('success', $message);
    }

    /**
     * Update the specified participant in storage.
     */
    public function update(Request $request, RelasiTour $participant)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tourid'  => 'required|exists:tournaments,tourid',
            'placement' => 'nullable|integer|min:1',
        ]);

        // Check if participant already exists (exclude current record)
        $existing = RelasiTour::where('user_id', $request->user_id)
                              ->where('tourid', $request->tourid)
                              ->where('id', '!=', $participant->id)
                              ->first();

        if ($existing) {
            return back()->withErrors([
                'user_id' => 'Participant sudah terdaftar untuk tournament ini.'
            ]);
        }

        $participant->update($request->all());

        return back()->with('success', 'Participant berhasil diperbarui.');
    }

    /**
     * Remove the specified participant from storage.
     */
    public function destroy(RelasiTour $participant)
    {
        $participantName = $participant->user ? $participant->user->name : 'Unknown';
        $tournamentName = $participant->tournament ? $participant->tournament->name : 'Unknown';
        
        $participant->delete();

        return back()->with('success', "Participant \"{$participantName}\" berhasil dihapus dari tournament \"{$tournamentName}\".");
    }

    /**
     * Sync participants for all tournaments with standings
     */
    public function syncParticipants()
    {
        $tournaments = Tournament::whereNotNull('url_startgg')
                                ->whereNotNull('sggid')
                                ->get();
        
        $syncedCount = 0;
        $errorCount = 0;
        $updatedCount = 0;
        $apiKey = env('STARTGG_API_KEY');

        if (!$apiKey) {
            return back()->with('error', 'Start.gg API key tidak ditemukan di environment.');
        }

        foreach ($tournaments as $tournament) {
            try {
                $result = $this->syncTournamentParticipantsData($tournament, $apiKey);
                $syncedCount += $result['synced'];
                $updatedCount += $result['updated'];
                
                // Sleep untuk menghindari rate limit
                usleep(500000); // 0.5 detik

            } catch (\Exception $e) {
                $errorCount++;
                \Log::error('Error syncing participants for tournament ' . $tournament->tourid . ': ' . $e->getMessage());
                continue;
            }
        }

        $message = "Sinkronisasi participants selesai. {$syncedCount} participant baru berhasil ditambahkan";
        if ($updatedCount > 0) {
            $message .= ", {$updatedCount} placement berhasil diperbarui";
        }
        $message .= ".";
        
        if ($errorCount > 0) {
            $message .= " {$errorCount} tournament gagal diproses.";
        }

        return back()->with('success', $message);
    }

    /**
     * Sync participants for a specific tournament
     */
    public function syncTournamentParticipants(Tournament $tournament)
    {
        if (!$tournament->url_startgg) {
            return back()->with('error', 'Tournament tidak memiliki URL Start.gg.');
        }

        $apiKey = env('STARTGG_API_KEY');

        if (!$apiKey) {
            return back()->with('error', 'Start.gg API key tidak ditemukan di environment.');
        }

        try {
            $result = $this->syncTournamentParticipantsData($tournament, $apiKey);

            $message = "Sinkronisasi selesai untuk tournament '{$tournament->name}'. {$result['synced']} participant baru ditambahkan";
            if ($result['updated'] > 0) {
                $message .= ", {$result['updated']} placement diperbarui";
            }
            $message .= ".";

            return back()->with('success', $message);

        } catch (\Exception $e) {
            \Log::error('Error syncing participants for tournament ' . $tournament->tourid . ': ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat sinkronisasi: ' . $e->getMessage());
        }
    }

    /**
     * Private method to sync tournament participants data
     */
    private function syncTournamentParticipantsData(Tournament $tournament, string $apiKey): array
    {
        $syncedCount = 0;
        $updatedCount = 0;
        $videogameId = env('TEKKEN_ID');

        // Query untuk mengambil standings dari tournament
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
                  placement
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
            'Content-Type'  => 'application/json',
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
            throw new \Exception('Failed to fetch data from Start.gg API');
        }

        $data = $response->json();

        if (!isset($data['data']['allEvents'])) {
            throw new \Exception('Tournament data not found');
        }

        $events = $data['data']['allEvents']['events'] ?? [];

        foreach ($events as $event) {
            $standings = $event['standings']['nodes'] ?? [];

            foreach ($standings as $standing) {
                $placement = $standing['placement'];
                $entrant = $standing['entrant'];
                $participants = $entrant['participants'] ?? [];

                foreach ($participants as $participant) {
                    if (isset($participant['player']['id'])) {
                        $playerId = $participant['player']['id'];
                        
                        // Cari user berdasarkan sgguserid (player ID)
                        $user = User::where('sgguserid', $playerId)->first();

                        if ($user) {
                            // Cek apakah relasi sudah ada
                            $existingRelation = RelasiTour::where('user_id', $user->id)
                                                         ->where('tourid', $tournament->tourid)
                                                         ->first();

                            if (!$existingRelation) {
                                // Buat relasi baru
                                RelasiTour::create([
                                    'user_id' => $user->id,
                                    'tourid' => $tournament->tourid,
                                    'placement' => $placement,
                                ]);
                                $syncedCount++;
                            } else {
                                // Update placement jika berbeda
                                if ($existingRelation->placement != $placement) {
                                    $existingRelation->update(['placement' => $placement]);
                                    $updatedCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        return [
            'synced' => $syncedCount,
            'updated' => $updatedCount,
        ];
    }

    /**
     * Get tournament statistics (untuk Inertia)
     */
    public function getTournamentStats(Request $request)
    {
        $tournaments = Tournament::select('tourid', 'name', 'category')
                                ->orderBy('name')
                                ->get();

        $stats = [];
        
        foreach ($tournaments as $tournament) {
            $participants = RelasiTour::where('tourid', $tournament->tourid)
                                     ->with('user')
                                     ->get();
                                     
            $stats[] = [
                'tournament' => $tournament,
                'total_participants' => $participants->count(),
                'with_placement' => $participants->where('placement', '!=', null)->count(),
                'top3_finishes' => $participants->where('placement', '<=', 3)->where('placement', '!=', null)->count(),
                'participants' => $participants,
            ];
        }

        return Inertia::render('Admin/Participants/Stats', [
            'stats' => $stats,
            'authUser' => auth()->user(),
        ]);
    }

    /**
     * Bulk operations for participants
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,update_placement',
            'participant_ids' => 'required|array',
            'participant_ids.*' => 'exists:relasi_tours,id',
            'placement' => 'nullable|integer|min:1',
        ]);

        $participants = RelasiTour::whereIn('id', $request->participant_ids)->get();
        
        if ($participants->isEmpty()) {
            return back()->with('error', 'Tidak ada participant yang dipilih.');
        }

        switch ($request->action) {
            case 'delete':
                $count = $participants->count();
                RelasiTour::whereIn('id', $request->participant_ids)->delete();
                return back()->with('success', "{$count} participant berhasil dihapus.");

            case 'update_placement':
                if (!$request->has('placement')) {
                    return back()->with('error', 'Placement diperlukan untuk update placement.');
                }
                
                RelasiTour::whereIn('id', $request->participant_ids)
                          ->update(['placement' => $request->placement]);
                          
                $count = $participants->count();
                return back()->with('success', "{$count} participant berhasil diupdate placement-nya ke #{$request->placement}.");

            default:
                return back()->with('error', 'Aksi tidak valid.');
        }
    }

    /**
     * Export participants data
     */
    public function export(Request $request)
    {
        $format = $request->get('format', 'csv');
        $tournamentId = $request->get('tournament_id');
        
        $query = RelasiTour::with(['user', 'tournament']);
        
        if ($tournamentId) {
            $query->where('tourid', $tournamentId);
        }
        
        $participants = $query->orderBy('placement', 'asc')
                             ->orderBy('created_at', 'desc')
                             ->get();

        if ($format === 'json') {
            // Untuk JSON export, tetap gunakan response()->json()
            // karena ini adalah download file, bukan render halaman
            return response()->json($participants);
        }

        // CSV Export
        $filename = 'participants_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($participants) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'ID',
                'Player Name',
                'SGG User ID',
                'Tournament Name',
                'Tournament Category',
                'Placement',
                'Created At',
                'Updated At'
            ]);

            // CSV Data
            foreach ($participants as $participant) {
                fputcsv($file, [
                    $participant->id,
                    $participant->user->name ?? 'N/A',
                    $participant->user->sgguserid ?? 'N/A',
                    $participant->tournament->name ?? 'N/A',
                    $this->getCategoryName($participant->tournament->category ?? null),
                    $participant->placement ?? 'N/A',
                    $participant->created_at->format('Y-m-d H:i:s'),
                    $participant->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get category name from category number
     */
    private function getCategoryName($category)
    {
        switch ($category) {
            case 1: return 'Major';
            case 2: return 'Minor';
            case 3: return 'Mini';
            default: return 'Unknown';
        }
    }
}