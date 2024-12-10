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
        Schema::create('vehicle_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');
            
            // Nuevos campos relevantes
            $table->timestamp('start_time'); // Hora de inicio del horario
            $table->timestamp('end_time')->nullable(); // Hora de fin del horario
            $table->json('route'); // Ruta en formato JSON
            $table->unsignedBigInteger('driver_id')->nullable(); // ID del conductor asignado
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null'); // Relación con la tabla de conductores
            
            // Información adicional
            $table->enum('status', ['activo', 'completado', 'cancelado']); // Estado del horario
            $table->text('notes')->nullable(); // Notas adicionales sobre el horario
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_schedules');
    }
};
