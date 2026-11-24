<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\RendezVous;
use Carbon\Carbon;

class StatsService
{
    public function __construct(private RendezVousService $rendezVous)
    {
    }

    public function tableauDeBord(): array
    {
        $aujourdhui = now()->toDateString();

        $planningDuJour = RendezVous::with('patient')
            ->where('statut', 'planifie')
            ->where('date', $aujourdhui)
            ->orderBy('heure')
            ->get();

        // Créneaux libres 
        $finSemaine = now()->endOfWeek(Carbon::SUNDAY)->toDateString();

        $creneauxLibres = $this->rendezVous
            ->lister($aujourdhui, $finSemaine, 'libre')
            ->count();

        return [
            'total_patients' => Patient::count(),
            'rdv_aujourdhui' => $planningDuJour->count(),
            'creneaux_libres' => $creneauxLibres,
            'planning_du_jour' => $planningDuJour,
            'patients_recents' => Patient::orderByDesc('id')->limit(4)->get(),
        ];
    }
}