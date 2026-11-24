<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'creneau_id' => 'nullable|integer|exists:rendez_vous,id',
            'motif' => 'nullable|string|max:255',
        ];
    }
}