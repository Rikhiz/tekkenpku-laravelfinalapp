<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
}
