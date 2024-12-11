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
            // Nombre único
            $table->string('name')->unique();
            // Coordenadas poligonales en formato GeoJSON
            $table->json('polygon_coordinates')->nullable(); // Para geocercas poligonales
        
            // Coordenadas y radio para geocercas circulares
            $table->decimal('latitude', 10, 8)->nullable(); // Opcional si es poligonal
            $table->decimal('longitude', 11, 8)->nullable(); // Opcional si es poligonal
            $table->integer('radius')->nullable(); // En metros, solo para círculos
        
            // Detalles de la geocerca
            $table->enum('type', ['zona_de_trabajo', 'zona_de_peligro', 'zona_de_descanso'])->default('zona_de_trabajo');
            $table->text('description')->nullable(); // Descripción opcional
        
            // Estado de la geocerca
            $table->boolean('is_active')->default(true); // Indica si la geocerca está activa
        
            // Relación con usuarios
            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        
            // Índices para búsquedas rápidas
            // $table->spatialIndex(['latitude', 'longitude']); // Solo funciona si estás usando MySQL con soporte geoespacial
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
