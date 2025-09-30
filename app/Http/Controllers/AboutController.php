<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $community = [
            'tagline' => 'Pekanbaru based Tekken community. Routine offline meetup, event and tournament.',
            'vision' => 'Become the leading Tekken community in Riau, known for competitive spirit and camaraderie.',
            'mission' => 'To unite Tekken players, provide regular competition opportunities, and promote esports culture in Pekanbaru.',
        ];

        return Inertia::render('About', [
            'community' => $community,
        ]);
    }
}
