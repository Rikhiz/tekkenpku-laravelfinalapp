<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RelasiTour;
use App\Models\Tournament;
use App\Models\User;

class AdminStartGGController extends Controller
{
    public function index()
    {
        $relasi = RelasiTour::with(['user', 'tournament'])->latest()->get();

        return Inertia::render('Admin/StartGG/Index', [
            'relasi' => $relasi,
            'tournaments' => Tournament::select('tourid', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tourid' => 'required|exists:tournaments,tourid',
            'placement' => 'required|integer',
        ]);

        RelasiTour::create($request->all());

        return redirect()->back()->with('success', 'Relasi berhasil ditambahkan.');
    }

    public function update(Request $request, RelasiTour $relasiTour)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tourid' => 'required|exists:tournaments,tourid',
            'placement' => 'required|integer',
        ]);

        $relasiTour->update($request->all());

        return redirect()->back()->with('success', 'Relasi berhasil diperbarui.');
    }

    public function destroy(RelasiTour $relasiTour)
    {
        $relasiTour->delete();

        return redirect()->back()->with('success', 'Relasi berhasil dihapus.');
    }
}
