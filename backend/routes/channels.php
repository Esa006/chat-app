<?php

use Illuminate\Support\Facades\Broadcast;

// ── Private conversation channel ──────────────────────
// Only participants of the conversation may subscribe.
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    if (!$user) return false;
    return $user->conversations()->where('conversations.id', (int) $conversationId)->exists();
}, ['guards' => ['sanctum']]);

// ── Presence channel — online users ──────────────────
Broadcast::channel('online', function ($user) {
    if (!$user) return null;
    return [
        'id'   => $user->id,
        'name' => $user->name,
    ];
}, ['guards' => ['sanctum']]);
