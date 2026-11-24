<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\RendezVous;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RendezVousService
{
    public function __construct(private NotificationService $notifications)
    {
    }

    public function lister(?string $du, ?string $au, ?string $statut): Collection
    {
        $debut = $du ? Carbon::parse($du)->startOfDay() : now()->startOfDay();
        $fin = $au ? Carbon::parse($au)->startOfDay() : $debut->copy()->addDays(6);

        if ($fin->gt($debut->copy()->addDays(31))) {
            $fin = $debut->copy()->addDays(31);
        }

        $limite = now()->startOfDay()->addDays(config('cabinet.horizon_jours'));
        $this->assurerCreneaux($debut, $fin->gt($limite) ? $limite->copy() : $fin);

        return RendezVous::with('patient')
            ->whereBetween('date', [$debut->toDateString(), $fin->toDateString()])
            ->when($statut, fn ($requete) => $requete->where('statut', $statut))
            ->orderBy('date')
            ->orderBy('heure')
            ->get()
            ->filter(fn ($rdv) => $rdv->statut === 'planifie' || ! $this->estPasse($rdv))
            ->values();
    }

    public function reserver(RendezVous $creneau, int $patientId, ?string $motif): RendezVous
    {
        return DB::transaction(function () use ($creneau, $patientId, $motif) {
            $creneau = RendezVous::lockForUpdate()->findOrFail($creneau->id);

            $this->verifierReservable($creneau);

            $creneau->update([
                'patient_id' => $patientId,
                'motif' => $motif,
                'statut' => 'planifie',
            ]);

            $patient = Patient::findOrFail($patientId);

            $this->notifications->notifierMedecins(
                "Nouveau rendez-vous : {$patient->nom} {$patient->prenom}, le " . $this->libelle($creneau)
            );

            return $creneau->load('patient');
        });
    }

    public function annuler(RendezVous $rdv): RendezVous
    {
        return DB::transaction(function () use ($rdv) {
            $rdv = RendezVous::lockForUpdate()->findOrFail($rdv->id);

            if ($rdv->statut !== 'planifie') {
                $this->refuser("Ce créneau n'est pas réservé.");
            }

            if ($this->estPasse($rdv)) {
                $this->refuser("Impossible d'annuler un rendez-vous passé.");
            }

            $patient = Patient::findOrFail($rdv->patient_id);
            $quand = $this->libelle($rdv);

            $rdv->update(['patient_id' => null, 'motif' => null, 'statut' => 'libre']);

            $this->notifications->notifierMedecins(
                "Rendez-vous annulé : {$patient->nom} {$patient->prenom}, le {$quand}"
            );

            return $rdv->fresh();
        });
    }

    public function modifier(RendezVous $rdv, ?int $nouveauCreneauId, ?string $motif): RendezVous
    {
        return DB::transaction(function () use ($rdv, $nouveauCreneauId, $motif) {
            $ids = array_unique(array_filter([$rdv->id, $nouveauCreneauId]));

            $lignes = RendezVous::whereIn('id', $ids)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $ancien = $lignes[$rdv->id];

            if ($ancien->statut !== 'planifie') {
                $this->refuser("Ce rendez-vous n'est pas planifié.");
            }

            if ($this->estPasse($ancien)) {
                $this->refuser('Impossible de modifier un rendez-vous passé.');
            }

            if (! $nouveauCreneauId || $nouveauCreneauId === $ancien->id) {
                if ($motif !== null) {
                    $ancien->update(['motif' => $motif]);
                }

                return $ancien->load('patient');
            }

            $nouveau = $lignes[$nouveauCreneauId];
            $this->verifierReservable($nouveau);

            $patient = Patient::findOrFail($ancien->patient_id);
            $avant = $this->libelle($ancien);

            $nouveau->update([
                'patient_id' => $ancien->patient_id,
                'motif' => $motif ?? $ancien->motif,
                'statut' => 'planifie',
            ]);

            $ancien->update(['patient_id' => null, 'motif' => null, 'statut' => 'libre']);

            $this->notifications->notifierMedecins(
                "Rendez-vous déplacé : {$patient->nom} {$patient->prenom}, du {$avant} au "
                . $this->libelle($nouveau)
            );

            return $nouveau->load('patient');
        });
    }

    private function verifierReservable(RendezVous $creneau): void
    {
        if ($creneau->statut !== 'libre') {
            $this->refuser('Ce créneau est déjà réservé.');
        }

        if (! in_array($creneau->date->dayOfWeekIso, config('cabinet.jours_ouvres'))) {
            $this->refuser('Le cabinet est fermé ce jour-là.');
        }

        if ($this->estPasse($creneau)) {
            $this->refuser('Ce créneau est déjà passé.');
        }
    }

    private function assurerCreneaux(Carbon $debut, Carbon $fin): void
    {
        $lignes = [];

        for ($jour = $debut->copy(); $jour->lte($fin); $jour->addDay()) {
            if (! in_array($jour->dayOfWeekIso, config('cabinet.jours_ouvres'))) {
                continue;
            }

            foreach (config('cabinet.heures') as $heure) {
                if ($jour->copy()->setTimeFromTimeString($heure)->isPast()) {
                    continue;
                }

                $lignes[] = [
                    'date' => $jour->toDateString(),
                    'heure' => $heure . ':00',
                    'statut' => 'libre',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if ($lignes) {
            RendezVous::insertOrIgnore($lignes);
        }
    }

    private function estPasse(RendezVous $rdv): bool
    {
        return $rdv->date->copy()->setTimeFromTimeString($rdv->heure)->isPast();
    }

    private function libelle(RendezVous $rdv): string
    {
        return $rdv->date->format('d/m/Y') . ' à ' . $rdv->heure;
    }

    private function refuser(string $message): never
    {
        throw ValidationException::withMessages(['creneau' => [$message]]);
    }
}