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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            
            // Número de serie del dispositivo
            $table->string('num_serial')->unique(); // Aseguramos que el número de serie sea único
            
            // Relación con vehículos
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');
            
            // Nuevos campos relevantes
            $table->enum('status', ['activo', 'inactivo', 'en_mantenimiento']); // Estado del dispositivo
            $table->string('type')->nullable(); // Tipo de dispositivo (ej. GPS, sensor, etc.)
            $table->text('description')->nullable(); // Descripción del dispositivo
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
