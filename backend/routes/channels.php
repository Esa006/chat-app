<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

// ── Private conversation channel ──────────────────────
// Only participants of the conversation may subscribe.
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return Conversation::whereHas(
        'participants',
        fn($q) => $q->where('users.id', $user->id)
    )->find($conversationId) !== null;
});

// ── Presence channel — online users ──────────────────
Broadcast::channel('online', function ($user) {
    return [
        'id'   => $user->id,
        'name' => $user->name,
    ];
});
