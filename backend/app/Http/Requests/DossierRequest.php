<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DossierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'allergies' => 'nullable|string|max:5000',
            'antecedents' => 'nullable|string|max:5000',
            'notes' => 'nullable|string|max:5000',
        ];
    }

    public function messages(): array
    {
        return [
            'groupe_sanguin.in' => 'Groupe sanguin invalide.',
            'allergies.max' => 'Les allergies sont trop longues.',
            'antecedents.max' => 'Les antécédents sont trop longs.',
            'notes.max' => 'Les notes sont trop longues.',
        ];
    }
}