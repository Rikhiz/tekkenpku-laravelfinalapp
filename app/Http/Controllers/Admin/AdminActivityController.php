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
        $rules = [
            'name' => 'required|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ];

        if ($request->hasFile('image_url')) {
            $rules['image_url'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:5120';
        } else {
            $rules['image_url'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        // 🎯 Proses upload gambar lokal
        if ($request->hasFile('image_url')) {
            $validated['image_url'] = $this->handleLocalImageUpload($request->file('image_url'));
        }

        Activity::create($validated);

        return redirect()->back()->with('success', 'Activity berhasil ditambahkan.');
    }

    /**
     * Update data activity.
     */
    public function update(Request $request, Activity $activity)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'url_ig' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ];

        if ($request->hasFile('image_url')) {
            $rules['image_url'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:5120';
        } else {
            $rules['image_url'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        // ✅ Hapus file lama kalau ada image baru
        if ($request->hasFile('image_url')) {
            if ($activity->image_url) {
                // ambil relative path dari URL lama (bisa format lama atau format baru)
                $oldPath = str_replace([url('storage/app/public/'), url('storage/')], '', $activity->image_url);
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
            $oldPath = str_replace([url('storage/app/public/'), url('storage/')], '', $activity->image_url);
            $oldPath = ltrim($oldPath, '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $activity->delete();

        return redirect()->back()->with('success', 'Activity berhasil dihapus.');
    }

    /**
     * Handle local image upload and compression
     */
    private function handleLocalImageUpload($file): ?string
    {
        try {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file->getRealPath());
            $encoded = $image->toWebp(80);

            // Simpan di folder tournaments seperti instruksi user
            $filename = 'tournaments/' . Str::random(40) . '.webp';

            // ✅ Simpan file ke storage/app/public/tournaments/
            Storage::disk('public')->put($filename, $encoded->toString());

            // ✅ URL standar Laravel melalui symlink public/storage
            return Storage::disk('public')->url($filename);
        } catch (\Exception $e) {
            \Log::error("Failed to process activity image: " . $e->getMessage());
        }

        return null;
    }

}