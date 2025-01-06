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
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null');
            // Información adicional
            $table->enum('status', ['pendiente', 'asignado', 'libre'])->default('libre');
            $table->boolean('status_time')->default(true);
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
