<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrdonnanceRequest;
use App\Models\Ordonnance;
use App\Models\Patient;
use App\Services\OrdonnanceService;

class OrdonnanceController extends Controller
{
    public function __construct(private OrdonnanceService $ordonnances)
    {
    }

    public function index(Patient $patient)
    {
        return $this->ordonnances->lister($patient);
    }

    public function store(OrdonnanceRequest $request, Patient $patient)
    {
        return response()->json(
            $this->ordonnances->creer($patient, $request->user(), $request->validated()),
            201
        );
    }

    public function destroy(Ordonnance $ordonnance)
    {
        $this->ordonnances->supprimer($ordonnance);

        return response()->noContent();
    }
}