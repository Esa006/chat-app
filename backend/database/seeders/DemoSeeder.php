<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        $alice = User::firstOrCreate(
            ['email' => 'alice@example.com'],
            ['name' => 'Alice Chen', 'password' => bcrypt('password123')]
        );

        $bob = User::firstOrCreate(
            ['email' => 'bob@example.com'],
            ['name' => 'Bob Smith', 'password' => bcrypt('password123')]
        );

        $carol = User::firstOrCreate(
            ['email' => 'carol@example.com'],
            ['name' => 'Carol White', 'password' => bcrypt('password123')]
        );

        // Create a private conversation between Alice and Bob
        $conv = Conversation::create(['type' => 'private']);
        $conv->participants()->attach([$alice->id, $bob->id]);

        // Seed some messages
        $messages = [
            ['user_id' => $alice->id, 'body' => 'Hey Bob! How are you?'],
            ['user_id' => $bob->id,   'body' => 'Hi Alice! All good, thanks! You?'],
            ['user_id' => $alice->id, 'body' => 'Great! Just testing out this new chat app 😄'],
            ['user_id' => $bob->id,   'body' => 'It looks amazing! Real-time messages work perfectly.'],
        ];

        foreach ($messages as $msg) {
            $conv->messages()->create(array_merge($msg, ['type' => 'text']));
        }

        // Group chat
        $group = Conversation::create(['type' => 'group', 'name' => 'Team ChatFlow']);
        $group->participants()->attach([$alice->id, $bob->id, $carol->id]);
        $group->messages()->create(['user_id' => $carol->id, 'body' => 'Welcome to the team chat! 🚀', 'type' => 'text']);

        $this->command->info('Demo users seeded:');
        $this->command->info('  alice@example.com / password123');
        $this->command->info('  bob@example.com   / password123');
        $this->command->info('  carol@example.com / password123');
    }
}
