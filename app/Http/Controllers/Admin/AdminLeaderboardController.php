<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leaderboard;
use App\Models\User;
use Inertia\Inertia;

class AdminLeaderboardController extends Controller
{
    /**
     * Display a listing of the leaderboard.
     */
   public function index()
    {
        $leaderboardAll = Leaderboard::with('user')->get();

        return Inertia::render('Admin/Leaderboard/Index', [
            'leaderboardAll' => $leaderboardAll,
            'authUser' => auth()->user()
        ]);
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

        return redirect()->route('admin.leaderboards.index')
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

        return redirect()->route('admin.leaderboards.index')
                         ->with('success', 'Leaderboard entry updated successfully.');
    }

    /**
     * Remove the specified leaderboard entry.
     */
    public function destroy(Leaderboard $leaderboard)
    {
        $leaderboard->delete();

        return redirect()->route('admin.leaderboards.index')
                         ->with('success', 'Leaderboard entry deleted successfully.');
    }
}
