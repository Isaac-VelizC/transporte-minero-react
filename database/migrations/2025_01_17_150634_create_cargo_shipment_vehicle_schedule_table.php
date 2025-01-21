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
        Schema::create('cargo_shipment_vehicle_schedule', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('set null');
            
            $table->unsignedBigInteger('conductor_id')->nullable();
            $table->foreign('conductor_id')->references('id')->on('personas')->onDelete('set null');
            
            $table->unsignedBigInteger('cargo_shipment_id');
            $table->unsignedBigInteger('vehicle_schedule_id');
            
            // Definición de claves foráneas
            $table->foreign('cargo_shipment_id')->references('id')->on('cargo_shipments')->onDelete('cascade');
            $table->foreign('vehicle_schedule_id')->references('id')->on('vehicle_schedules')->onDelete('cascade');
        
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargo_shipment_vehicle_schedule');
    }
};
