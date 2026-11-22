<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AssistantService
{
    public function lister(): Collection
    {
        return User::where('role', 'assistant')->orderBy('nom')->get();
    }

    // Ghir les assistants: l'médecin ma yt'lm'ssch hna
    public function trouver(int $id): User
    {
        return User::where('role', 'assistant')->findOrFail($id);
    }

    public function creer(array $donnees): User
    {
        return User::create([
            'nom' => $donnees['nom'],
            'email' => $donnees['email'],
            'password' => $donnees['password'],
            'role' => 'assistant',
        ]);
    }

    public function modifier(int $id, array $donnees): User
    {
        $assistant = $this->trouver($id);

        $assistant->nom = $donnees['nom'];
        $assistant->email = $donnees['email'];

        // Mot de passe khawi = ma nbdlouhch
        if (! empty($donnees['password'])) {
            $assistant->password = $donnees['password'];
        }

        $assistant->save();

        return $assistant;
    }

    public function supprimer(int $id): void
    {
        $assistant = $this->trouver($id);

        // Kay'khsr l'accès dyalo hta ila kan connecté
        $assistant->tokens()->delete();
        $assistant->delete();
    }
}