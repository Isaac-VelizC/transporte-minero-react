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
        Schema::create('vehicle_reports', function (Blueprint $table) {
            $table->id();

            // Relación con vehículos
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');

            // Nuevos campos relevantes
            $table->enum('status', ['operativo', 'en_mantenimiento', 'fuera_de_servicio']); // Estado del vehículo
            $table->dateTime('change_time'); // Fecha y hora del cambio de estado
            $table->text('description')->nullable(); // Descripción del informe (opcional)

            // Información adicional
            $table->unsignedBigInteger('reported_by')->nullable(); // ID del usuario que reporta
            $table->foreign('reported_by')->references('id')->on('users')->onDelete('set null'); // Relación con la tabla de usuarios

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_reports');
    }
};
