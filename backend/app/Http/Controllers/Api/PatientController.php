<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function __construct(private PatientService $patients) {}

    public function index(Request $request)
    {
        return $this->patients->lister($request->query('recherche'));
    }

    public function show(Patient $patient)
    {
        return $patient->load('dossier');
    }

    public function store(PatientRequest $request)
    {
        return response()->json($this->patients->creer($request->validated()), 201);
    }

    public function update(PatientRequest $request, Patient $patient)
    {
        return $this->patients->modifier($patient, $request->validated());
    }

    public function destroy(Patient $patient)
    {
        $this->patients->supprimer($patient);

        return response()->noContent();
    }
}
