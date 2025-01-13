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
        Schema::create('ruta_devices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('envio_id')->nullable();
            $table->foreign('envio_id')->references('id')->on('cargo_shipments')->onDelete('cascade');
            $table->unsignedBigInteger('device_id')->nullable();
            $table->foreign('device_id')->references('id')->on('devices')->onDelete('cascade');
            $table->json('coordenadas');
            $table->string('color', 10)->default('blue');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruta_devices');
    }
};
