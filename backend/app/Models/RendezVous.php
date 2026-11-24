<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RendezVous extends Model
{
    protected $table = 'rendez_vous';

    protected $fillable = ['patient_id', 'date', 'heure', 'motif', 'statut'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    protected function heure(): Attribute
    {
        return Attribute::make(get: fn (string $valeur) => substr($valeur, 0, 5));
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}