<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->nullable()->constrained('patients')->nullOnDelete();
        $table->date('date');
        $table->time('heure');
        $table->string('motif')->nullable();
        $table->enum('statut', ['libre', 'planifie'])->default('libre');
        $table->timestamps();

        $table->unique(['date', 'heure']);
    });      
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
