<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Inertia\Inertia;

// Tambahkan ini di routes/web.php:
// use App\Http\Controllers\ActivityController;
// Route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
// Route::get('/activity/{id}', [ActivityController::class, 'show'])->name('activity.show');

class ActivityController extends Controller
{
    /**
     * Display a listing of activities for public view
     */
    public function index()
    {
        $activities = Activity::with('creator')
            ->orderBy('tanggal_kegiatan', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($activity) {
                // Status mapping
                $statusColor = $activity->status === 'Mendatang'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-gray-600/20 text-gray-400 border-gray-600/30';

                return [
                    'id' => $activity->id,
                    'slug' => $activity->slug,
                    'name' => $activity->name,
                    'description' => $activity->desc,
                    'image_url' => $activity->image_url,
                    'url_ig' => $activity->url_ig,
                    'alamat' => $activity->alamat,
                    'status' => $activity->status,
                    'status_color' => $statusColor,
                    'tanggal_kegiatan' => $activity->tanggal_kegiatan,
                    'created_by' => $activity->creator->name ?? 'Unknown',
                    'created_at' => $activity->created_at,
                ];
            });

        // Separate upcoming and completed activities
        $upcomingActivities = $activities->where('status', 'Mendatang')->values();
        $completedActivities = $activities->where('status', 'Selesai')->values();

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'upcomingActivities' => $upcomingActivities,
            'completedActivities' => $completedActivities,
        ]);
    }

    /**
     * Display the specified activity
     */
    public function show(Activity $activity)
    {
        // Status color mapping
        $statusColor = $activity->status === 'Mendatang'
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : 'bg-gray-600/20 text-gray-400 border-gray-600/30';

        $activityData = [
            'id' => $activity->id,
            'name' => $activity->name,
            'description' => $activity->desc,
            'image_url' => $activity->image_url,
            'url_ig' => $activity->url_ig,
            'alamat' => $activity->alamat,
            'status' => $activity->status,
            'status_color' => $statusColor,
            'tanggal_kegiatan' => $activity->tanggal_kegiatan,
            'created_by' => $activity->creator->name ?? 'Unknown',
            'created_at' => $activity->created_at,
        ];

        return Inertia::render('Activity/Show', [
            'activity' => $activityData,
        ]);
    }
}