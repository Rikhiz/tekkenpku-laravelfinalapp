<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminStartGGController;
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
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'created_by'  => 'required|exists:users,id',
            'category'    => 'required|integer',
            'total'       => 'nullable|integer',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
            'image_url'   => 'nullable|string|max:255',
            'desc'        => 'nullable|string|max:255',
            'prizepool'   => 'nullable|string|max:255',
            'max_pemain'  => 'nullable|integer',
            'url_yt'      => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status'      => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid'       => 'nullable|integer',
        ]);

        // 🎯 ubah link StartGG -> slug
        if (!empty($validated['url_startgg'])) {
            if (preg_match('/tournament\/([^\/]+)/', $validated['url_startgg'], $matches)) {
                $validated['url_startgg'] = $matches[1];
            }
        }

        // 🎯 ubah link Google Drive -> direct link
        if (!empty($validated['image_url'])) {
            $validated['image_url'] = $this->convertGoogleDriveLink($validated['image_url']);
        }

        // 🎯 kalau status = Selesai, ambil data StartGG
        if ($validated['status'] === 'Selesai' && !empty($validated['url_startgg'])) {
            $apiData = app(AdminStartGGController::class)->getTournamentData($validated['url_startgg']);
            if ($apiData) {
                $validated = array_merge($validated, $apiData);
            }
        }

        Tournament::create($validated);

        return redirect()->back()->with('success', 'Tournament berhasil ditambahkan.');
    }

    public function update(Request $request, Tournament $tournament)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'created_by'  => 'required|exists:users,id',
            'category'    => 'required|integer',
            'total'       => 'nullable|integer',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
            'image_url'   => 'nullable|string|max:255',
            'desc'        => 'nullable|string|max:255',
            'prizepool'   => 'nullable|string|max:255',
            'max_pemain'  => 'nullable|integer',
            'url_yt'      => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status'      => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid'       => 'nullable|integer',
        ]);

        // 🎯 ubah link StartGG -> slug
        if (!empty($validated['url_startgg'])) {
            if (preg_match('/tournament\/([^\/]+)/', $validated['url_startgg'], $matches)) {
                $validated['url_startgg'] = $matches[1];
            }
        }

        // 🎯 ubah link Google Drive -> direct link
        if (!empty($validated['image_url'])) {
            $validated['image_url'] = $this->convertGoogleDriveLink($validated['image_url']);
        }

        // 🎯 kalau status berubah jadi "Selesai"
        if ($tournament->status !== 'Selesai' 
            && $validated['status'] === 'Selesai' 
            && !empty($validated['url_startgg'])) 
        {
            $apiData = app(AdminStartGGController::class)->getTournamentData($validated['url_startgg']);
            if ($apiData) {
                $validated = array_merge($validated, $apiData);
            }
        }

        $tournament->update($validated);

        return redirect()->back()->with('success', 'Tournament berhasil diperbarui.');
    }

    /**
     * Convert Google Drive link -> direct link
     */
    private function convertGoogleDriveLink(string $url): string
    {
        if (preg_match('/file\/d\/([^\/]+)/', $url, $matches)) {
            return "https://drive.google.com/uc?id=" . $matches[1];
        }
        return $url;
    }

    public function destroy(Tournament $tournament)
    {
        $tournament->delete();
        return redirect()->back()->with('success', 'Tournament berhasil dihapus.');
    }
}
