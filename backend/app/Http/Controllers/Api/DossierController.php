<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DossierRequest;
use App\Models\Patient;
use App\Services\DossierService;

class DossierController extends Controller
{
    public function __construct(private DossierService $dossiers)
    {
    }

    public function update(DossierRequest $request, Patient $patient)
    {
        return $this->dossiers->modifier($patient, $request->validated(), $request->user());
    }
}