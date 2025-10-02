<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminStartGGController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tournament;
use App\Models\User;
use App\Models\BanList;

class AdminTournamentsController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::with('creator')->latest()->get();

        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments,
            'users' => User::where('role', 'admin')->select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'image_url' => 'nullable|string|max:255',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|integer',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid' => 'nullable|integer',
            
            'dojo' => 'nullable|in:Yes,No',
        ]);

        // 🎯 ubah link StartGG -> slug
        if (!empty($validated['url_startgg'])) {
            if (preg_match('/tournament\/([^\/]+)/', $validated['url_startgg'], $matches)) {
                $validated['url_startgg'] = $matches[1];
            }
        }

        // 🎯 ubah link Google Drive -> direct link
        if (!empty($validated['image_url'])) {
            $validated['image_url'] = $this->handleGoogleDriveImage($validated['image_url']);
        }

        // 🎯 kalau status = Selesai, ambil data StartGG
        if ($validated['status'] === 'Selesai' && !empty($validated['url_startgg'])) {
            $apiData = app(AdminStartGGController::class)->getTournamentData($validated['url_startgg']);
            if ($apiData) {
                $validated = array_merge($validated, $apiData);
            }
        }

        $tournament = Tournament::create($validated);

        // 🔥 NEW: Reset ban list when tournament is completed
        if ($validated['status'] === 'Selesai') {
            $this->resetBanListForCategory($validated['category']);
        }

        return redirect()->back()->with('success', 'Tournament berhasil ditambahkan.');
    }

    private function handleGoogleDriveImage(string $url): ?string
    {
        // Ambil fileId dari Google Drive link
        if (preg_match('/file\/d\/([^\/]+)/', $url, $matches)) {
            $fileId = $matches[1];
            $downloadUrl = "https://drive.google.com/uc?export=download&id=" . $fileId;

            try {
                // Download file dari Drive
                $response = Http::get($downloadUrl);

                if ($response->successful()) {
                    $fileContent = $response->body();
                    $filename = 'tournaments/' . Str::random(40) . '.jpg';

                    // Upload ke storage default (misalnya S3 / local)
                    Storage::disk('public')->put($filename, $fileContent);

                    // Return URL publik
                    return Storage::disk('public')->url($filename);
                }
            } catch (\Exception $e) {
                \Log::error("Failed to download Google Drive image: " . $e->getMessage());
            }
        }

        return null;
    }

    public function update(Request $request, Tournament $tournament)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'image_url' => 'nullable|string|max:255',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|integer',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid' => 'nullable|integer',
            'dojo' => 'nullable|in:Yes,No',
        ]);

        // ✅ Hapus file lama kalau ada image baru DAN berbeda dari yang lama
        if ($request->filled('image_url') && $request->image_url !== $tournament->image_url) {
            if ($tournament->image_url) {
                // ambil relative path dari URL lama
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $tournament->image_url);

                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Jika link baru dari Google Drive → proses download
            if (str_contains($request->image_url, 'drive.google.com')) {
                $validated['image_url'] = $this->handleGoogleDriveImage($request->image_url);
            } else {
                $validated['image_url'] = $request->image_url;
            }
        } else {
            unset($validated['image_url']); // kalau kosong atau sama → jangan overwrite
        }

        // 🎯 ubah link StartGG -> slug
        if (!empty($validated['url_startgg'])) {
            if (preg_match('/tournament\/([^\/]+)/', $validated['url_startgg'], $matches)) {
                $validated['url_startgg'] = $matches[1];
            }
        }

        // 🔥 NEW: Check if status changed to "Selesai"
        $statusChangedToSelesai = $tournament->status !== 'Selesai' && $validated['status'] === 'Selesai';

        // 🎯 kalau status berubah jadi "Selesai"
        if ($statusChangedToSelesai && !empty($validated['url_startgg'])) {
            $apiData = app(AdminStartGGController::class)->getTournamentData($validated['url_startgg']);
            if ($apiData) {
                $validated = array_merge($validated, $apiData);
            }
        }

        $tournament->update($validated);

        // 🔥 NEW: Reset ban list when status changes to "Selesai"
        if ($statusChangedToSelesai) {
            $this->resetBanListForCategory($validated['category']);
        }

        return redirect()->back()->with('success', 'Tournament berhasil diperbarui.');
    }

    /**
     * Reset ban status for specific category when tournament is completed
     * Category 1 = Major, 2 = Minor, 3 = Mini
     */
    private function resetBanListForCategory(int $category)
    {
        $columnToReset = match($category) {
            1 => 'major',
            2 => 'minor',
            3 => 'mini',
            default => null
        };

        if ($columnToReset) {
            DB::table('ban_lists')
                ->update([$columnToReset => 'No']);

            \Log::info("Reset ban list for category: {$columnToReset}");
        }
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
        if ($tournament->image_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $tournament->image_url);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $tournament->delete();
        return redirect()->back()->with('success', 'Tournament berhasil dihapus.');
    }
}