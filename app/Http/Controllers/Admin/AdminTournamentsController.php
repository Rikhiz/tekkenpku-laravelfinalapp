<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tournament;
use App\Models\User;

class AdminTournamentsController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::with('creator')->latest()->get();

        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments,
            'users' => User::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'image_url' => 'nullable|string|max:255',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|string|max:255',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
        ]);

        $data = $request->all();

        // Jika ada url_startgg, ambil slug tournament
        if (!empty($data['url_startgg'])) {
            // regex untuk ambil slug
            if (preg_match('/tournament\/([^\/]+)/', $data['url_startgg'], $matches)) {
                $data['url_startgg'] = $matches[1];
            }
        }

        Tournament::create($data);

        return redirect()->back()->with('success', 'Tournament berhasil ditambahkan.');
    }

    public function update(Request $request, Tournament $tournament)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'image_url' => 'nullable|string|max:255',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|string|max:255',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
        ]);

        $tournament->update($request->all());

        return redirect()->back()->with('success', 'Tournament berhasil diperbarui.');
    }

    public function destroy(Tournament $tournament)
    {
        $tournament->delete();

        return redirect()->back()->with('success', 'Tournament berhasil dihapus.');
    }
}
