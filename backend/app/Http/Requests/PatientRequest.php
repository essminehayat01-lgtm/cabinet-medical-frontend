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
}
