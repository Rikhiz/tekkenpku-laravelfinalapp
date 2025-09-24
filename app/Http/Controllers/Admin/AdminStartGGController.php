<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tournament;
use app\Models\User;
use Illuminate\Support\Facades\Http;

class AdminStartGGController extends Controller
{
    /**
     * Ambil data tournament dari StartGG API berdasarkan slug
     */
    public function getTournamentData(string $slug): ?array
    {
        $apiKey = env('STARTGG_API_KEY');
        $videogameId = env('tekken_id');

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
                  entrant { id name }
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
        ])->post('https://api.start.gg/gql/alpha', [
            'query' => $query,
            'variables' => [
                'tourneySlug' => $slug,
                'videogameId' => [(int) $videogameId],
                'page' => 1,
                'perPage' => 500,
            ],
        ]);

        if ($response->failed()) {
            return null;
        }

        $result = $response->json();

        if (empty($result['data']['allEvents'])) {
            return null;
        }

        $tourney = $result['data']['allEvents'];

        $apiData = [
            'name'   => $tourney['name'] ?? null,
            'tourid' => $tourney['id'] ?? null,
        ];

        if (!empty($tourney['events'][0])) {
            $apiData['sggid']      = $tourney['events'][0]['id'];
            $apiData['max_pemain'] = count($tourney['events'][0]['standings']['nodes'] ?? []);
        }

        return $apiData;
    }
     public function syncAllPlayers()
    {
        $tournaments = Tournament::all();
        $syncedCount = 0;

        foreach ($tournaments as $tournament) {
            $query = <<<'GRAPHQL'
            query TournamentEntrants($slug: String!) {
              tournament(slug: $slug) {
                id
                name
                participants(query: { perPage: 100 }) {
                  nodes {
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
            GRAPHQL;

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('STARTGG_API_KEY'),
            ])->post('https://api.start.gg/gql/alpha', [
                'query' => $query,
                'variables' => [
                    'slug' => $tournament->slug, // pakai slug dari DB tournaments
                ],
            ]);

            $data = $response->json();

            if (!isset($data['data']['tournament'])) {
                continue; // skip kalau data ga valid
            }

            $players = $data['data']['tournament']['participants']['nodes'] ?? [];

            foreach ($players as $player) {
                if (isset($player['user']['id'])) {
                    User::updateOrCreate(
                        ['sgguserid' => $player['user']['id']],
                        [
                            'name' => $player['gamerTag'] ?? $player['user']['name'] ?? 'Unknown',
                            'role' => 'player',
                            'email' => null,
                            'password' => null,
                        ]
                    );
                    $syncedCount++;
                }
            }
        }

        return back()->with('success', "Sinkronisasi selesai. Total {$syncedCount} player diproses.");
    }
}
