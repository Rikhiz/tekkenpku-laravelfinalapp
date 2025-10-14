<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
            'users' => User::select('id', 'name')->get(),
            'authUser' => auth()->user(),
        ]);
    }

    /**
     * Simpan activity baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ]);

        Activity::create($request->all());

        return redirect()->back()->with('success', 'Activity berhasil ditambahkan.');
    }

    /**
     * Update data activity.
     */
    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
            'alamat' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'status' => 'required|in:Mendatang,Selesai',
            'tanggal_kegiatan' => 'nullable|date',
        ]);

        $activity->update($request->all());

        return redirect()->back()->with('success', 'Activity berhasil diperbarui.');
    }

    /**
     * Hapus activity.
     */
    public function destroy(Activity $activity)
    {
        $activity->delete();

        return redirect()->back()->with('success', 'Activity berhasil dihapus.');
    }
}
