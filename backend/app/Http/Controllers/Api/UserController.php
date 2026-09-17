<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Search users by name or email (excludes self).
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->query('q', '');
        $myId  = $request->user()->id;

        $users = User::where('id', '!=', $myId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(20)
            ->get(['id', 'name', 'email', 'avatar', 'is_online', 'last_seen_at']);

        return response()->json($users);
    }
}
