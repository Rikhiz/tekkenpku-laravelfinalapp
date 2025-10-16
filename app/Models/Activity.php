<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image_url',
        'url_ig',
        'created_by',
        'alamat',
        'desc',
        'status',
        'tanggal_kegiatan',
    ];
    public function getRouteKeyName()
    {
        return 'slug';
    }
    protected static function booted()
    {
        static::creating(function ($activity) {
            $activity->slug = Str::slug($activity->name);
        });
        static::updating(function ($activity) {
            $activity->slug = Str::slug($activity->name);
        });

    }


    /**
     * Relasi ke user pembuat activity
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

}
