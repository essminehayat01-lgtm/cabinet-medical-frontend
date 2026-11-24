<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PatientService
{
    public function lister(?string $recherche = null): Collection
    {
        return Patient::with('dossier')
            ->when($recherche, function ($requete) use ($recherche) {
                $requete->where(function ($q) use ($recherche) {
                    $q->where('nom', 'like', "%{$recherche}%")
                        ->orWhere('prenom', 'like', "%{$recherche}%");
                });
            })
            ->orderBy('nom')
            ->get();
    }
    public function creer(array $donnees): Patient
    {
        return DB::transaction(function () use ($donnees) {
            $patient = Patient::create($donnees);
            $patient->dossier()->create([]);

            return $patient;
        });
    }

    public function modifier(Patient $patient, array $donnees): Patient
    {
        $patient->update($donnees);

        return $patient;
    }
    public function supprimer(Patient $patient): void
    {
        DB::transaction(function () use ($patient) {
            $patient->rendezVous()->update([
                'patient_id' => null,
                'motif' => null,
                'statut' => 'libre',
            ]);

            $patient->delete();
        });
    }
}
