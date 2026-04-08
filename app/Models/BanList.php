<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BanList extends Model
{
    use HasFactory;

    protected $fillable = [
        'finals',
        'prime',
        'core',
        'bit',
        'scout',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
