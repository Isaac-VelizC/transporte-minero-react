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
            $table->json('polygon_coordinates')->nullable();
            // Coordenadas y radio para geocercas circulares
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('radius')->nullable();
            // Detalles de la geocerca
            $table->enum('type', ['zona_de_trabajo', 'zona_de_peligro', 'zona_de_descanso'])->default('zona_de_trabajo');
            $table->text('description')->nullable();
            // Estado de la geocerca
            $table->boolean('is_active')->default(true);
            // Relación con usuarios
            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            // Índices para búsquedas rápidas
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
