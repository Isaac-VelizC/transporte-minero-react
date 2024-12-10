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
        Schema::create('vehicle_trajectories', function (Blueprint $table) {
            $table->id();
            
            // Relación con vehículos
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');
            
            // Nuevos campos relevantes
            $table->string("start_point"); // Punto de inicio
            $table->string("end_point"); // Punto de destino
            $table->json('path'); // Ruta en formato JSON, puede incluir coordenadas
            $table->dateTime('start_time'); // Hora de inicio de la trayectoria
            $table->dateTime('end_time')->nullable(); // Hora de fin de la trayectoria, opcional
            
            // Información adicional
            $table->decimal('distance', 10, 2)->nullable(); // Distancia recorrida en kilómetros o metros
            $table->enum('status', ['completada', 'en_progreso', 'cancelada']); // Estado de la trayectoria
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_trajectories');
    }
};
