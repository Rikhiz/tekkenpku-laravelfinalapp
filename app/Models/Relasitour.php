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

    public function scopeMostOverPlacement($query, $limit = 1 , $f)
{
    return $query->selectRaw('user_id, COUNT(*) as total_over')
        ->where('placement', '<', $f)
        ->groupBy('user_id')
        ->orderByDesc('total_over')
        ->with('user')
        ->limit($limit);
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
