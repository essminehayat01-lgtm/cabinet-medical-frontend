<?php

namespace App\Services;

use App\Models\Ordonnance;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OrdonnanceService
{
    public function lister(Patient $patient): Collection
    {
        return $patient->ordonnances()
            ->with(['medicaments', 'medecin'])
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();
    }

    public function creer(Patient $patient, User $medecin, array $donnees): Ordonnance
    {
        return DB::transaction(function () use ($patient, $medecin, $donnees) {
            $ordonnance = $patient->ordonnances()->create([
                'user_id' => $medecin->id,
                'date' => now()->toDateString(),
                'remarques' => $donnees['remarques'] ?? null,
            ]);

            $ordonnance->medicaments()->createMany($donnees['medicaments']);

            return $ordonnance->load(['medicaments', 'medecin']);
        });
    }

    public function supprimer(Ordonnance $ordonnance): void
    {
        $ordonnance->delete();
    }
}