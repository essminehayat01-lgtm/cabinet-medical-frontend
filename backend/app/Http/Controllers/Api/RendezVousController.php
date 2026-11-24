<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModificationRequest;
use App\Http\Requests\RendezVousFiltreRequest;
use App\Http\Requests\ReservationRequest;
use App\Models\RendezVous;
use App\Services\RendezVousService;

class RendezVousController extends Controller
{
    public function __construct(private RendezVousService $rendezVous)
    {
    }

    public function index(RendezVousFiltreRequest $request)
    {
        return $this->rendezVous->lister(
            $request->validated('du'),
            $request->validated('au'),
            $request->validated('statut')
        );
    }

    public function reserver(ReservationRequest $request, RendezVous $rendezVous)
    {
        return $this->rendezVous->reserver(
            $rendezVous,
            $request->validated('patient_id'),
            $request->validated('motif')
        );
    }

    public function update(ModificationRequest $request, RendezVous $rendezVous)
    {
        return $this->rendezVous->modifier(
            $rendezVous,
            $request->validated('creneau_id'),
            $request->validated('motif')
        );
    }

    public function destroy(RendezVous $rendezVous)
    {
        return $this->rendezVous->annuler($rendezVous);
    }
}