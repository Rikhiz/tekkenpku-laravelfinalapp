<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelasiTour extends Model
{
    use HasFactory;

    protected $table = 'relasitour';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'tourid',
        'placement',
    ];

    // App\Models\RelasiTour.php

    public function scopeMostFrequentPlacement($query, $placementValue)
    {
        return $query
            ->select('user_id', \DB::raw('COUNT(*) as count'))
            ->where('placement', '<=', $placementValue)
            ->where('user_id', '!=', 4747588)
            ->whereNotNull('placement')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit(1);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tourid', 'tourid');
    }
}
