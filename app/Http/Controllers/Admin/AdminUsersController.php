<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUsersController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'sgguserid', 'role', 'created_at')
                     ->latest()
                     ->get();

        return Inertia::render('Admin/Users/Index', [
            'usersall' => $users,
            'users'    => User::select('id', 'name')->get(),
            'authUser' => auth()->user(), // ✅ user login
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'authUser' => auth()->user(), // ✅ user login
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user'     => $user,
            'authUser' => auth()->user(), // ✅ user login
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'nullable|email|unique:users,email',
            'sgguserid' => 'nullable|integer|unique:users,sgguserid',
            'password'  => 'nullable|string|min:6',
            'role'      => 'required|in:admin,player',
        ]);

        User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'sgguserid' => $request->sgguserid,
            'password'  => $request->password ? Hash::make($request->password) : null,
            'role'      => $request->role,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'nullable|email|unique:users,email,' . $user->id,
            'sgguserid' => 'nullable|integer|unique:users,sgguserid,' . $user->id,
            'password'  => 'nullable|string|min:6',
            'role'      => 'required|in:admin,player',
        ]);

        $user->update([
            'name'      => $request->name,
            'email'     => $request->email,
            'sgguserid' => $request->sgguserid,
            'password'  => $request->password ? Hash::make($request->password) : $user->password,
            'role'      => $request->role,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
    }
}
