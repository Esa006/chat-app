<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Paginated message history for a conversation (newest last).
     */
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $perPage = (int) $request->query('per_page', 30);
        $page    = (int) $request->query('page', 1);

        $paginated = $conversation->messages()
            ->with('user')
            ->oldest()
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($paginated);
    }

    /**
     * Store a new message and broadcast it.
     */
    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $validated = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body'    => $validated['body'],
            'type'    => 'text',
        ]);

        $message->load('user');

        // Update conversation timestamp
        $conversation->touch();

        // Broadcast to all subscribers on this private channel
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    /**
     * Mark all messages in a conversation as read for the current user.
     */
    public function markRead(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $conversation->participants()
            ->updateExistingPivot($request->user()->id, ['last_read_at' => now()]);

        return response()->json(['message' => 'Marked as read.']);
    }
}
