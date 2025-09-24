<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'sgguserid', // tambahkan ini
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function tournaments()
    {
        return $this->hasMany(Tournament::class, 'created_by', 'id');
    }

    public function relasi()
    {
        return $this->hasMany(RelasiTour::class, 'user_id', 'id');
    }
}
