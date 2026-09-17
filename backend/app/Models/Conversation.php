<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type'];

    public function participants()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class)->latest();
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    /**
     * Find an existing private conversation between two users.
     */
    public static function findPrivateBetween(int $userA, int $userB): ?self
    {
        return self::where('type', 'private')
            ->whereHas('participants', fn($q) => $q->where('users.id', $userA))
            ->whereHas('participants', fn($q) => $q->where('users.id', $userB))
            ->whereHas('participants', fn($q) => $q->havingRaw('COUNT(*) = 2'))
            ->first();
    }
}
