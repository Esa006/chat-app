<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    /**
     * List all conversations for the authenticated user,
     * ordered by most recent message.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::whereHas('participants', fn($q) => $q->where('users.id', $userId))
            ->with([
                'participants',
                'lastMessage.user',
            ])
            ->orderByDesc(function ($query) {
                $query->select('created_at')
                    ->from('messages')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->latest()
                    ->limit(1);
            })
            ->get()
            ->map(function (Conversation $conv) use ($userId) {
                $pivot = $conv->participants->firstWhere('id', $userId)?->pivot;
                $lastReadAt = $pivot?->last_read_at;

                $unreadCount = $lastReadAt
                    ? $conv->messages()->where('created_at', '>', $lastReadAt)
                        ->where('user_id', '!=', $userId)
                        ->count()
                    : $conv->messages()->where('user_id', '!=', $userId)->count();

                return [
                    'id'           => $conv->id,
                    'name'         => $conv->name,
                    'type'         => $conv->type,
                    'participants' => $conv->participants,
                    'last_message' => $conv->lastMessage,
                    'unread_count' => $unreadCount,
                    'updated_at'   => $conv->updated_at,
                ];
            });

        return response()->json($conversations);
    }

    /**
     * Create a private or group conversation.
     * For private, reuses an existing one if it already exists.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'integer|exists:users,id',
            'name' => 'nullable|string|max:255',
            'type' => 'in:private,group',
        ]);

        $type = $validated['type'] ?? 'private';
        $ids  = $validated['participant_ids'];
        $myId = $request->user()->id;

        // Reuse existing private conversation
        if ($type === 'private' && count($ids) === 1) {
            $existing = Conversation::findPrivateBetween($myId, $ids[0]);
            if ($existing) {
                $existing->load(['participants', 'lastMessage.user']);
                return response()->json($this->formatConversation($existing, $myId), 200);
            }
        }

        $conv = Conversation::create([
            'name' => $validated['name'] ?? null,
            'type' => $type,
        ]);

        $allIds = array_unique(array_merge([$myId], $ids));
        $conv->participants()->attach($allIds);
        $conv->load(['participants', 'lastMessage.user']);

        return response()->json($this->formatConversation($conv, $myId), 201);
    }

    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);
        $conversation->load(['participants', 'lastMessage.user']);
        return response()->json($this->formatConversation($conversation, $request->user()->id));
    }

    private function formatConversation(Conversation $conv, int $userId): array
    {
        return [
            'id'           => $conv->id,
            'name'         => $conv->name,
            'type'         => $conv->type,
            'participants' => $conv->participants,
            'last_message' => $conv->lastMessage,
            'unread_count' => 0,
            'updated_at'   => $conv->updated_at,
        ];
    }
}
