<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Demo Users
        $alice = User::updateOrCreate(
            ['email' => 'alice@example.com'],
            ['name' => 'Alice Smith', 'password' => Hash::make('password123'), 'is_online' => true]
        );

        $bob = User::updateOrCreate(
            ['email' => 'bob@example.com'],
            ['name' => 'Bob Jones', 'password' => Hash::make('password123'), 'is_online' => true]
        );

        $carol = User::updateOrCreate(
            ['email' => 'carol@example.com'],
            ['name' => 'Carol Williams', 'password' => Hash::make('password123'), 'is_online' => false]
        );

        $dave = User::updateOrCreate(
            ['email' => 'dave@example.com'],
            ['name' => 'Dave Miller', 'password' => Hash::make('password123'), 'is_online' => false]
        );

        // 2. Create Public / Group Channels
        $generalGroup = Conversation::create([
            'name' => '🌍 General Community Channel',
            'type' => 'group',
        ]);
        $generalGroup->participants()->attach([$alice->id, $bob->id, $carol->id, $dave->id]);

        $techGroup = Conversation::create([
            'name' => '⚡ Tech & Developers Channel',
            'type' => 'group',
        ]);
        $techGroup->participants()->attach([$alice->id, $bob->id, $dave->id]);

        // Seed messages in General Channel
        Message::create([
            'conversation_id' => $generalGroup->id,
            'user_id' => $alice->id,
            'body' => 'Welcome everyone to the General Community Channel! 👋',
        ]);
        Message::create([
            'conversation_id' => $generalGroup->id,
            'user_id' => $bob->id,
            'body' => 'Hey Alice! Glad to be here. Real-time WebSockets with Laravel Reverb work awesome! 🚀',
        ]);
        Message::create([
            'conversation_id' => $generalGroup->id,
            'user_id' => $carol->id,
            'body' => 'Hello team! Testing out the group chat functionality.',
        ]);

        // Seed messages in Tech Channel
        Message::create([
            'conversation_id' => $techGroup->id,
            'user_id' => $dave->id,
            'body' => 'Has anyone deployed Laravel Echo with Reverb in production yet?',
        ]);
        Message::create([
            'conversation_id' => $techGroup->id,
            'user_id' => $alice->id,
            'body' => 'Yes! Make sure ShouldBroadcastNow and auth:sanctum guards are set properly.',
        ]);

        // 3. Create Private 1-on-1 Channels / Conversations
        // Private 1: Alice <-> Bob
        $privateAliceBob = Conversation::create(['type' => 'private']);
        $privateAliceBob->participants()->attach([$alice->id, $bob->id]);

        Message::create([
            'conversation_id' => $privateAliceBob->id,
            'user_id' => $alice->id,
            'body' => 'Hi Bob, did you review the latest pull request?',
        ]);
        Message::create([
            'conversation_id' => $privateAliceBob->id,
            'user_id' => $bob->id,
            'body' => 'Hey Alice! Yes, looks great to me. All real-time WebSocket listeners are working without reloading.',
        ]);

        // Private 2: Alice <-> Carol
        $privateAliceCarol = Conversation::create(['type' => 'private']);
        $privateAliceCarol->participants()->attach([$alice->id, $carol->id]);

        Message::create([
            'conversation_id' => $privateAliceCarol->id,
            'user_id' => $carol->id,
            'body' => 'Hi Alice, let me know when you are available for a quick sync.',
        ]);
        Message::create([
            'conversation_id' => $privateAliceCarol->id,
            'user_id' => $alice->id,
            'body' => 'Sure Carol! I am free now.',
        ]);

        // Private 3: Bob <-> Dave
        $privateBobDave = Conversation::create(['type' => 'private']);
        $privateBobDave->participants()->attach([$bob->id, $dave->id]);

        Message::create([
            'conversation_id' => $privateBobDave->id,
            'user_id' => $dave->id,
            'body' => 'Hey Bob, see you at the meeting later!',
        ]);
    }
}
