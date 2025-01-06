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
        Schema::create('tipo_mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('vehiculo_mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->text('observaciones')->nullable();
            $table->enum('estado', ['pendiente', 'en curso', 'terminado'])->default('pendiente');
            $table->unsignedBigInteger('tipo')->nullable();
            $table->foreign('tipo')->references('id')->on('tipo_mantenimientos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_mantenimientos');
        Schema::dropIfExists('vehiculo_mantenimientos');
    }
};
