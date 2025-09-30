<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Get latest tournaments with video URLs (for video section)
        $videoTournaments = Tournament::whereNotNull('url_yt')
            ->where('url_yt', '!=', '')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($tournament) {
                return [
                    'id' => $tournament->tourid,
                    'name' => $tournament->name,
                    'description' => $tournament->desc,
                    'url_yt' => $tournament->url_yt,
                    'image_url' => $tournament->image_url,
                    'video_id' => $this->extractYoutubeId($tournament->url_yt),
                    'start_date' => $tournament->start_date,
                    'created_at' => $tournament->created_at,
                ];
            });

        // Get latest tournaments (for tournament section)
        $latestTournaments = Tournament::orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($tournament) {
                // Status mapping based on database enum
                $statusColor = $tournament->status === 'Pendaftaran Dibuka' 
                    ? 'bg-[#F2AF29]/20 text-[#F2AF29]' 
                    : 'bg-[#69747C]/20 text-[#69747C]';

                // Count participants from relasitour
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
                ];
            });

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'videoTournaments' => $videoTournaments,
            'latestTournaments' => $latestTournaments,
        ]);
    }

    /**
     * Extract YouTube video ID from URL
     */
    private function extractYoutubeId($url)
    {
        if (empty($url)) {
            return null;
        }

        // Handle different YouTube URL formats
        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $url, $matches);
        
        return $matches[1] ?? null;
    }

    /**
     * Get YouTube thumbnail URL from video URL
     */
    private function getYoutubeThumbnail($url)
    {
        $videoId = $this->extractYoutubeId($url);
        
        if (!$videoId) {
            return null;
        }

        // Use maxresdefault for highest quality, fallback to hqdefault if not available
        return "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg";
    }
}