<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Periksa user login dan role admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Access denied'], 403);
            }

            // Redirect ke halaman 403 Inertia
            return Inertia::render('Errors/403')->toResponse($request)
                ->setStatusCode(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}