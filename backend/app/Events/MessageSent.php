<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        // Load the user relationship for broadcasting
        $this->message->load('user');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("conversation.{$this->message->conversation_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id'              => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'user_id'         => $this->message->user_id,
                'user'            => [
                    'id'         => $this->message->user->id,
                    'name'       => $this->message->user->name,
                    'email'      => $this->message->user->email,
                    'avatar'     => $this->message->user->avatar,
                    'is_online'  => $this->message->user->is_online,
                    'last_seen_at' => $this->message->user->last_seen_at,
                ],
                'body'       => $this->message->body,
                'type'       => $this->message->type,
                'read_at'    => $this->message->read_at,
                'created_at' => $this->message->created_at->toIso8601String(),
            ],
        ];
    }
}
