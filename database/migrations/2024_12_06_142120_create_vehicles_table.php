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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('matricula')->unique(); // Aseguramos que la matrícula sea única
            $table->unsignedBigInteger('mark_id')->nullable();
            $table->foreign('mark_id')->references('id')->on('marks')->onDelete('cascade');
            $table->unsignedBigInteger('type_id')->nullable();
            $table->foreign('type_id')->references('id')->on('type_vehicles')->onDelete('cascade');
            $table->unsignedBigInteger('device_id')->nullable();
            $table->foreign('device_id')->references('id')->on('devices')->onDelete('set null');
            
            // Nuevos campos relevantes
            $table->string('image')->nullable(); // Imagen del Vehiculo
            $table->string('modelo', 50); // Marca del vehículo
            $table->string('color', 30)->nullable(); // Color del vehículo
            $table->date('fecha_compra'); // Año de fabricación
            $table->enum('status', ['activo', 'mantenimiento', 'inactivo']); // Agregamos 'inactivo'
            $table->string('kilometrage')->nullable();
            
            // Información del responsable
            $table->unsignedBigInteger('responsable_id')->nullable();
            $table->foreign('responsable_id')->references('id')->on('personas')->onDelete('set null');
            // Información adicional
            $table->integer('capacidad_carga')->default(0);
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
