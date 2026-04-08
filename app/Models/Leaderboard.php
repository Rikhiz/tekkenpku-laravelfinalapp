<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    use HasFactory;

    protected $table = 'leaderboards';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'season',
        'player_name',
        'finals',
        'prime',
        'core',
        'bit',
        'scout',
        'total_points',
        'counted_finals_events',
        'counted_prime_events',
        'counted_core_events',
        'counted_bit_events',
        'counted_scout_events',
        'total_finals_events',
        'total_prime_events',
        'total_core_events',
        'total_bit_events',
        'total_scout_events',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
}
