<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\BanList;
use Inertia\Inertia;

class TournamentsController extends Controller
{
    /**
     * Display a listing of tournaments
     */
    public function index()
    {
        $tournaments = Tournament::with(['creator', 'relasi.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tournament) {
                // Status mapping
                $statusColor = $tournament->status === 'Pendaftaran Dibuka' 
                    ? 'bg-[#F2AF29]/20 text-[#F2AF29] border-[#F2AF29]/30' 
                    : 'bg-blue-500/20 text-blue-500 border-blue-500/30';

                // Category mapping
                $categoryMap = [
                    1 => ['name' => 'Major', 'color' => 'text-yellow-400', 'bg' => 'bg-yellow-400/10'],
                    2 => ['name' => 'Minor', 'color' => 'text-blue-400', 'bg' => 'bg-blue-400/10'],
                    3 => ['name' => 'Mini', 'color' => 'text-green-400', 'bg' => 'bg-green-400/10'],
                ];

                $category = $categoryMap[$tournament->category] ?? ['name' => 'Unknown', 'color' => 'text-gray-400', 'bg' => 'bg-gray-400/10'];

                // Count participants
                $participantCount = $tournament->relasi()->count();
                $maxParticipants = $tournament->max_pemain ?? 0;

                return [
                    'id' => $tournament->tourid,
                    'name' => $tournament->name,
                    'description' => $tournament->desc,
                    'start_date' => $tournament->start_date,
                    'end_date' => $tournament->end_date,
                    'status' => $tournament->status,
                    'status_color' => $statusColor,
                    'prize_pool' => $tournament->prizepool,
                    'participants' => $participantCount,
                    'max_participants' => $maxParticipants,
                    'image_url' => $tournament->image_url,
                    'category' => $tournament->category,
                    'category_name' => $category['name'],
                    'category_color' => $category['color'],
                    'category_bg' => $category['bg'],
                    'url_yt' => $tournament->url_yt,
                    'url_startgg' => $tournament->url_startgg,
                    'created_by' => $tournament->creator->name ?? 'Unknown',
                    'created_at' => $tournament->created_at,
                ];
            });

        // Get ban list with user information
        $banList = BanList::with('user')->get()->map(function ($ban) {
            return [
                'id' => $ban->id,
                'user_id' => $ban->user_id,
                'user_name' => $ban->user->name ?? 'Unknown',
                'user_email' => $ban->user->email ?? 'N/A',
                'major' => $ban->major,
                'minor' => $ban->minor,
                'mini' => $ban->mini,
                'created_at' => $ban->created_at,
            ];
        });

        return Inertia::render('Tournaments/Index', [
            'tournaments' => $tournaments,
            'banList' => $banList,
        ]);
    }

    /**
     * Display the specified tournament
     */
    public function show($id)
    {
        $tournament = Tournament::with(['creator', 'relasi.user'])
            ->where('tourid', $id)
            ->firstOrFail();

        // Status mapping
        $statusColor = $tournament->status === 'Pendaftaran Dibuka' 
            ? 'bg-[#F2AF29]/20 text-[#F2AF29] border-[#F2AF29]/30' 
            : 'bg-blue-500/20 text-blue-500 border-blue-500/30';

        // Category mapping
        $categoryMap = [
            1 => ['name' => 'Major', 'color' => 'text-yellow-400', 'bg' => 'bg-yellow-400/10'],
            2 => ['name' => 'Minor', 'color' => 'text-blue-400', 'bg' => 'bg-blue-400/10'],
            3 => ['name' => 'Mini', 'color' => 'text-green-400', 'bg' => 'bg-green-400/10'],
        ];

        $category = $categoryMap[$tournament->category] ?? ['name' => 'Unknown', 'color' => 'text-gray-400', 'bg' => 'bg-gray-400/10'];

        // Get participants
        $participants = $tournament->relasi->map(function ($relasi) {
            return [
                'id' => $relasi->id,
                'user_id' => $relasi->user_id,
                'name' => $relasi->user->name ?? 'Unknown',
                'placement' => $relasi->placement,
            ];
        })->sortBy('placement')->values();

        $tournamentData = [
            'id' => $tournament->tourid,
            'name' => $tournament->name,
            'description' => $tournament->desc,
            'start_date' => $tournament->start_date,
            'end_date' => $tournament->end_date,
            'status' => $tournament->status,
            'status_color' => $statusColor,
            'prize_pool' => $tournament->prizepool,
            'participants_count' => $participants->count(),
            'max_participants' => $tournament->max_pemain ?? 0,
            'image_url' => $tournament->image_url,
            'category' => $tournament->category,
            'category_name' => $category['name'],
            'category_color' => $category['color'],
            'category_bg' => $category['bg'],
            'url_yt' => $tournament->url_yt,
            'url_startgg' => $tournament->url_startgg,
            'created_by' => $tournament->creator->name ?? 'Unknown',
            'created_at' => $tournament->created_at,
            'participants' => $participants,
        ];

        return Inertia::render('Tournaments/Show', [
            'tournament' => $tournamentData,
        ]);
    }
}