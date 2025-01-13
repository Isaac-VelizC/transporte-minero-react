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
        Schema::create('cargo_shipments', function (Blueprint $table) {
            $table->id();
            // Relación con vehículos
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('set null');
            $table->unsignedBigInteger('programming')->nullable();
            $table->foreign('programming')->references('id')->on('vehicle_schedules')->onDelete('set null');
            $table->unsignedBigInteger('geofence_id')->nullable();
            $table->foreign('geofence_id')->references('id')->on('geocercas')->onDelete('set null');

            // Relación con clientes
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')->references('id')->on('personas')->onDelete('cascade');
            $table->unsignedBigInteger('conductor_id')->nullable();
            $table->foreign('conductor_id')->references('id')->on('personas')->onDelete('set null');
            
            // Nuevos campos relevantes
            $table->decimal('peso', 10, 2);
            $table->string('origen');
            $table->string('destino');
            $table->enum('status', ['pendiente', 'en_transito', 'entregado', 'cancelado'])->default('pendiente');
            $table->boolean('delete')->default(true);

            // Información adicional
            $table->timestamp('fecha_envio')->default(now());
            $table->timestamp('fecha_entrega')->nullable();
            $table->decimal('client_latitude', 10, 8)->nullable();
            $table->decimal('client_longitude', 11, 8)->nullable();
            $table->decimal('origen_latitude', 10, 8)->nullable();
            $table->decimal('origen_longitude', 11, 8)->nullable();
            $table->text('notas')->nullable();
            
            $table->integer('sub_total', 11)->default(0);
            $table->integer('total', 11)->default(0);
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargo_shipments');
    }
};
