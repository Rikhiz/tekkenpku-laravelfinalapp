<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RelasiTour;
use App\Models\User;
use App\Models\Tournament;

class AdminParticipantController extends Controller
{
    /**
     * Display a listing of participants.
     */
    public function index()
    {
        $participantsAll = RelasiTour::with('user', 'tournament')->get();

        return Inertia::render('Admin/Participants/Index', [
            'participantsAll' => $participantsAll,
            'authUser' => auth()->user(), // supaya AdminLayout bisa pakai
        ]);
    }

    /**
     * Show the form for creating a new participant.
     */
    public function create()
    {
        return Inertia::render('Admin/Participants/Create', [
            'users' => User::select('id', 'name')->get(),
            'tournaments' => Tournament::select('tourid', 'name')->get(),
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
            'placement' => 'nullable|integer',
        ]);

        RelasiTour::create($request->all());

        return redirect()->route('admin.participants.index')
                         ->with('success', 'Participant added successfully.');
    }

    /**
     * Display the specified participant.
     */
    public function show(RelasiTour $participant)
    {
        return Inertia::render('Admin/Participants/Show', [
            'participant' => $participant->load(['user', 'tournament']),
        ]);
    }

    /**
     * Show the form for editing the specified participant.
     */
    public function edit(RelasiTour $participant)
    {
        return Inertia::render('Admin/Participants/Edit', [
            'participant' => $participant,
            'users' => User::select('id', 'name')->get(),
            'tournaments' => Tournament::select('tourid', 'name')->get(),
        ]);
    }

    /**
     * Update the specified participant in storage.
     */
    public function update(Request $request, RelasiTour $participant)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tourid'  => 'required|exists:tournaments,tourid',
            'placement' => 'nullable|integer',
        ]);

        $participant->update($request->all());

        return redirect()->route('admin.participants.index')
                         ->with('success', 'Participant updated successfully.');
    }

    /**
     * Remove the specified participant from storage.
     */
    public function destroy(RelasiTour $participant)
    {
        $participant->delete();

        return redirect()->route('admin.participants.index')
                         ->with('success', 'Participant deleted successfully.');
    }
}
