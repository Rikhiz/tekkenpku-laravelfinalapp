<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galleries extends Model
{
    use HasFactory;

    protected $table = 'galleries';
    protected $primaryKey = 'id';

    protected $fillable = [
        'tour_id',
        'title',
        'description',
        'image_path',
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tour_id', 'tourid');
    }
}
