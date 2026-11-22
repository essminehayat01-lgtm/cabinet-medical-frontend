<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ordonnance extends Model
{
    protected $fillable = ['patient_id', 'user_id', 'date', 'remarques'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    // Le médecin li kteb l'ordonnance
    public function medecin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function medicaments(): HasMany
    {
        return $this->hasMany(OrdonnanceMedicament::class);
    }
}
