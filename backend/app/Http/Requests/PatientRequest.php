<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:2|max:100',
            'prenom' => 'required|string|min:2|max:100',
            'sexe' => 'required|in:F,M',
            'date_naissance' => 'required|date|before:today',
            'telephone' => ['required', 'regex:/^0\d{9}$/'],
            'adresse' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.min' => 'Le nom doit contenir au moins 2 caractères.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'prenom.min' => 'Le prénom doit contenir au moins 2 caractères.',
            'sexe.required' => 'Le sexe est obligatoire.',
            'sexe.in' => 'Le sexe doit être F ou M.',
            'date_naissance.required' => 'La date de naissance est obligatoire.',
            'date_naissance.date' => 'La date de naissance est invalide.',
            'date_naissance.before' => 'La date de naissance doit être dans le passé.',
            'telephone.required' => 'Le téléphone est obligatoire.',
            'telephone.regex' => 'Téléphone invalide (10 chiffres, commence par 0).',
        ];
    }
}