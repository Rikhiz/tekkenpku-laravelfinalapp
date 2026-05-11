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
        $rules = [
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'season'      => 'nullable|integer',
            'end_date' => 'nullable|date',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|integer',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid' => 'nullable|integer',
            'dojo' => 'nullable|in:Yes,No',
        ];

        if ($request->hasFile('image_url')) {
            $rules['image_url'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:5120';
        } else {
            $rules['image_url'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        // 🎯 ubah link StartGG -> slug
        if (!empty($validated['url_startgg'])) {
            if (preg_match('/tournament\/([^\/]+)/', $validated['url_startgg'], $matches)) {
                $validated['url_startgg'] = $matches[1];
            }
        }

        // 🎯 Proses upload gambar lokal
        if ($request->hasFile('image_url')) {
            $validated['image_url'] = $this->handleLocalImageUpload($request->file('image_url'));
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

    private function handleLocalImageUpload($file): ?string
    {
        try {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file->getRealPath());
            $encoded = $image->toWebp(80);

            $filename = 'tournaments/' . Str::random(40) . '.webp';

            // ✅ Simpan file ke storage/app/public/tournaments/
            Storage::disk('public')->put($filename, $encoded->toString());

            // ✅ URL standar Laravel melalui symlink public/storage
            return Storage::disk('public')->url($filename);
        } catch (\Exception $e) {
            \Log::error("Failed to process tournament image: " . $e->getMessage());
        }

        return null;
    }


    public function update(Request $request, $id)
    {
        $tournament = Tournament::where('tourid', $id)->firstOrFail();

        $rules = [
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
            'category' => 'required|integer',
            'total' => 'nullable|integer',
            'season'      => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'desc' => 'nullable|string|max:255',
            'prizepool' => 'nullable|integer',
            'max_pemain' => 'nullable|integer',
            'url_yt' => 'nullable|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'url_startgg' => 'nullable|string|max:255',
            'status' => 'required|in:Selesai,Pendaftaran Dibuka',
            'sggid' => 'nullable|integer',
            'dojo' => 'nullable|in:Yes,No',
        ];

        if ($request->hasFile('image_url')) {
            $rules['image_url'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:5120';
        } else {
            $rules['image_url'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        // ✅ Hapus file lama kalau ada image baru
        if ($request->hasFile('image_url')) {
            if ($tournament->image_url) {
                // ambil relative path dari URL lama (bisa format lama atau format baru)
                $oldPath = str_replace([url('storage/app/public/'), url('storage/')], '', $tournament->image_url);
                $oldPath = ltrim($oldPath, '/');

                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Proses upload gambar lokal
            $validated['image_url'] = $this->handleLocalImageUpload($request->file('image_url'));
        } else {
            // Jika tidak upload file, jangan ubah URL gambar yang lama
            unset($validated['image_url']);
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
        $columnToReset = match ($category) {
            1 => 'finals',
            2 => 'prime',
            3 => 'core',
            4 => 'bit',
            5 => 'scout',
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

    public function destroy($id)
    {
        $tournament = Tournament::where('tourid', $id)->firstOrFail();

        if ($tournament->image_url) {
            $oldPath = str_replace([url('storage/app/public/'), url('storage/')], '', $tournament->image_url);
            $oldPath = ltrim($oldPath, '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $tournament->delete();
        return redirect()->back()->with('success', 'Tournament berhasil dihapus.');
    }
}