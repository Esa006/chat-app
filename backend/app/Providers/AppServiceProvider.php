<?php

namespace App\Providers;

use App\Models\Conversation;
use App\Policies\ConversationPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Conversation::class => ConversationPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Allow Sanctum to authenticate via token for broadcasting
        Gate::before(function ($user, $ability) {
            // Super-admin bypass can go here if needed
        });
    }
}
