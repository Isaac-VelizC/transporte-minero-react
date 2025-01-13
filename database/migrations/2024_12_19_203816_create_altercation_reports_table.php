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
        Schema::create('altercation_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('set null');
            $table->unsignedBigInteger('envio_id')->nullable();
            $table->foreign('envio_id')->references('id')->on('cargo_shipments')->onDelete('cascade');
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null');
            $table->text('description');
            $table->dateTime('fecha')->default(now());
            $table->decimal('last_latitude', 10, 7)->nullable();
            $table->decimal('last_longitude', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('altercation_reports');
    }
};
