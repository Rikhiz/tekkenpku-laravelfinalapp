<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galleries;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Tournament;
use App\Models\RelasiTour;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/AdminDashboard', [
            'stats' => [
                'users' => User::count(),
                'tournaments' => Tournament::count(),
                'galleries' => Galleries::count(),
                'relasi' => RelasiTour::count(),
            ]
        ]);
    }
}
