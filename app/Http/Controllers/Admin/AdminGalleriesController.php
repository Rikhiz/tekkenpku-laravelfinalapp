<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Galleries;
use App\Models\Tournament;

class AdminGalleriesController extends Controller
{
    public function index()
    {
        $galleries = Galleries::with('tournament')->latest()->get();

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
            'tournaments' => Tournament::select('tourid', 'name')->get(),
            'authUser' => auth()->user()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tour_id' => 'required|exists:tournaments,tourid',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'required|string|max:255',
        ]);

        Galleries::create($request->all());

        return redirect()->back()->with('success', 'Gallery berhasil ditambahkan.');
    }

    public function update(Request $request, Galleries $gallery)
    {
        $request->validate([
            'tour_id' => 'required|exists:tournaments,tourid',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'required|string|max:255',
        ]);

        $gallery->update($request->all());

        return redirect()->back()->with('success', 'Gallery berhasil diperbarui.');
    }

    public function destroy(Galleries $gallery)
    {
        $gallery->delete();

        return redirect()->back()->with('success', 'Gallery berhasil dihapus.');
    }
}
