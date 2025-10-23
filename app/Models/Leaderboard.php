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
        'player_name',
        'major',
        'minor',
        'mini',
        'total_points',
        'counted_major_events',
        'counted_minor_events',
        'counted_mini_events',
        'total_major_events',
        'total_minor_events',
        'total_mini_events',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
}
