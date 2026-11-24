<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    public function notifierMedecins(string $message): void
    {
        User::where('role', 'medecin')->get()->each(function ($medecin) use ($message) {
            Notification::create([
                'user_id' => $medecin->id,
                'message' => $message,
            ]);
        });
    }

    public function lister(User $user): Collection
    {
        return Notification::where('user_id', $user->id)->latest()->get();
    }

    public function marquerLues(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);
    }
}