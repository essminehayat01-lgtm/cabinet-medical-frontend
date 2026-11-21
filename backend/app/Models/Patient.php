<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Patient extends Model
{
    protected $fillable = [
        'nom', 'prenom', 'sexe', 'date_naissance', 'telephone', 'adresse',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date:Y-m-d',
        ];
    }

    public function dossier(): HasOne
    {
        return $this->hasOne(DossierMedical::class);
    }

    public function rendezVous(): HasMany
    {
        return $this->hasMany(RendezVous::class);
    }

    public function ordonnances(): HasMany
    {
        return $this->hasMany(Ordonnance::class);
    }
}