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
        Schema::create('geocercas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Aseguramos que el nombre sea único
            $table->json('coordinates'); // Coordenadas en formato JSON
            $table->text('description')->nullable(); // Descripción opcional
            $table->enum('type', ['zona_de_trabajo', 'zona_de_peligro', 'zona_de_descanso']); // Tipo de geocerca
            $table->unsignedBigInteger('created_by')->nullable(); // ID del usuario que creó la geocerca
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); // Relación con la tabla de usuarios
            
            // Campos adicionales
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geocercas');
    }
};
