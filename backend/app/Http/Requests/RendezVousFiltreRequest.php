<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RendezVousFiltreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'du' => 'nullable|date',
            'au' => 'nullable|date|after_or_equal:du',
            'statut' => 'nullable|in:libre,planifie',
        ];
    }
}