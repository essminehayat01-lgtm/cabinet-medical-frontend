<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // L'compte l'wahid li kaykoun mojoud: dyal l'médecin
        User::firstOrCreate(
            ['email' => 'medecin@cabinet.ma'],
            [
                'nom' => 'Dr. Alaoui',
                'password' => '1234',
                'role' => 'medecin',
            ]
        );
    }
}