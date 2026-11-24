<?php

namespace App\Services;

use App\Models\DossierMedical;
use App\Models\Patient;
use App\Models\User;

class DossierService
{
    public function modifier(Patient $patient, array $donnees, User $user): DossierMedical
    {
        if (! $user->estMedecin()) {
            unset($donnees['notes']);
        }

        $dossier = $patient->dossier()->firstOrCreate([]);
        $dossier->update($donnees);

        return $dossier;
    }
}