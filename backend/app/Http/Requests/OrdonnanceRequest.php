<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrdonnanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'medicaments' => 'required|array|min:1',
            'medicaments.*.nom' => 'required|string|max:255',
            'medicaments.*.dosage' => 'nullable|string|max:255',
            'medicaments.*.duree' => 'nullable|string|max:255',
            'remarques' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'medicaments.required' => 'Ajoutez au moins un médicament.',
            'medicaments.min' => 'Ajoutez au moins un médicament.',
            'medicaments.*.nom.required' => 'Le nom du médicament est obligatoire.',
        ];
    }
}