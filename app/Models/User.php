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
        'sgguserid',
        'avatar', // ← Tambahkan ini
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

    /**
     * Get avatar URL with fallback
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return $this->avatar;
        }

        // Fallback ke initial avatar
        return $this->generateInitialAvatar();
    }

    /**
     * Generate avatar URL from UI Avatars API
     */
    private function generateInitialAvatar()
    {
        $name = urlencode($this->name);
        return "https://ui-avatars.com/api/?name={$name}&size=128&background=FF2146&color=F2F2F2&bold=true";
    }
}