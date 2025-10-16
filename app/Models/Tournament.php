<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $table = 'tournaments';
    protected $primaryKey = 'tourid';

    protected $fillable = [
        'name',
        'created_by',
        'category',
        'total',
        'start_date',
        'end_date',
        'image_url',
        'desc',
        'prizepool',
        'max_pemain',
        'url_yt',
        'url_startgg',
        'status',
        'tourid',
        'event_id',
        'sggid', // <- ini
        'type',
        'dojo',
    ];

    public function getRouteKeyName()
    {
        return 'url_startgg';
    }


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class, 'tour_id', 'tourid');
    }

    public function relasi()
    {
        return $this->hasMany(RelasiTour::class, 'tourid', 'tourid');
    }
}
