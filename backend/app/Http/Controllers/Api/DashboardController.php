<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatsService;

class DashboardController extends Controller
{
    public function __construct(private StatsService $stats)
    {
    }

    public function index()
    {
        return $this->stats->tableauDeBord();
    }
}