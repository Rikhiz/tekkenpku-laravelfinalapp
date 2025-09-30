<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BanList;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBanListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil daftar banlist dengan relasi user
        $banlists = BanList::with('user')
            ->orderByDesc('id')
            ->paginate(10);

        // Ambil daftar user untuk dropdown (misalnya semua user)
        $users = User::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/BanList/Index', [
            'banlists' => $banlists,
            'users' => $users,
            'authUser' => auth()->user(),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all(['id', 'name']);
        return Inertia::render('Admin/BanList/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'major' => 'required|in:Yes,No',
            'minor' => 'required|in:Yes,No',
            'mini'  => 'required|in:Yes,No',
            'user_id' => 'required|exists:users,id',
        ]);

        BanList::create($validated);

        return redirect()->route('banlist.index')->with('success', 'Ban list entry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banlist = BanList::with('user')->findOrFail($id);

        return Inertia::render('Admin/BanList/Show', [
            'banlist' => $banlist,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $banlist = BanList::findOrFail($id);
        $users = User::all(['id', 'name']);

        return Inertia::render('Admin/BanList/Edit', [
            'banlist' => $banlist,
            'users'   => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banlist = BanList::findOrFail($id);

        $validated = $request->validate([
            'major' => 'required|in:Yes,No',
            'minor' => 'required|in:Yes,No',
            'mini'  => 'required|in:Yes,No',
            'user_id' => 'required|exists:users,id',
        ]);

        $banlist->update($validated);

        return redirect()->route('banlist.index')->with('success', 'Ban list entry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banlist = BanList::findOrFail($id);
        $banlist->delete();

        return redirect()->route('banlist.index')->with('success', 'Ban list entry deleted successfully.');
    }
}
