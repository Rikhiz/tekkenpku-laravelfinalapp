<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('Gallery/Index');
    }
}
