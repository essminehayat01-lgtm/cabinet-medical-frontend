<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notifications)
    {
    }

    public function index(Request $request)
    {
        return $this->notifications->lister($request->user());
    }

    public function marquerLues(Request $request)
    {
        $this->notifications->marquerLues($request->user());

        return response()->noContent();
    }
}