<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image_url',
        'created_by',
        'alamat',
        'desc',
        'status',
        'tanggal_kegiatan',
    ];

    /**
     * Relasi ke user pembuat activity
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
