<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class PatientService
{
    // Règle métier: kol patient jdid kay'cree dossier khawi m3ah
    public function creer(array $donnees): Patient
    {
        return DB::transaction(function () use ($donnees) {
            $patient = Patient::create($donnees);
            $patient->dossier()->create([]);
            return $patient;
        });
    }
}