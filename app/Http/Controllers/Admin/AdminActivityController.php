<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\User;

class AdminActivityController extends Controller
{
    /**
     * Tampilkan daftar seluruh activity.
     */
    public function index()
    {
        $activities = Activity::with('creator')->latest()->get();

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
            'users' => User::where('role', 'admin')->select('id', 'name')->get(),
            'authUser' => auth()->user(),
        ]);
    }

    /**
     * Simpan activity baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ]);

        // 🎯 ubah link Google Drive -> direct link dan simpan ke storage
        if (!empty($validated['image_url'])) {
            $validated['image_url'] = $this->handleGoogleDriveImage($validated['image_url']);
        }

        Activity::create($validated);

        return redirect()->back()->with('success', 'Activity berhasil ditambahkan.');
    }

    /**
     * Update data activity.
     */
    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ]);

        // ✅ Hapus file lama kalau ada image baru DAN berbeda dari yang lama
        if ($request->filled('image_url') && $request->image_url !== $activity->image_url) {
            if ($activity->image_url) {
                // ambil relative path dari URL lama
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $activity->image_url);

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

        $activity->update($validated);

        return redirect()->back()->with('success', 'Activity berhasil diperbarui.');
    }

    /**
     * Hapus activity.
     */
    public function destroy(Activity $activity)
    {
        // Hapus file image jika ada
        if ($activity->image_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $activity->image_url);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $activity->delete();

        return redirect()->back()->with('success', 'Activity berhasil dihapus.');
    }

    /**
     * Handle Google Drive image download and storage
     */
    private function handleGoogleDriveImage(string $url): ?string
{
    if (preg_match('/file\/d\/([^\/]+)/', $url, $matches)) {
        $fileId = $matches[1];
        $downloadUrl = "https://drive.google.com/uc?export=download&id=" . $fileId;

        try {
            $response = Http::get($downloadUrl);

            if ($response->successful()) {
                $fileContent = $response->body();
                $filename = 'activities/' . Str::random(40) . '.jpg';

                // ✅ Simpan file tetap di storage/app/public/tournaments/
                Storage::disk('public')->put($filename, $fileContent);

                // ✅ URL untuk database (tambahkan app/public di tengah)
                return url('storage/app/public/' . $filename);
            }
        } catch (\Exception $e) {
            \Log::error("Failed to download Google Drive image (Tournament): " . $e->getMessage());
        }
    }

    return null;
}

}