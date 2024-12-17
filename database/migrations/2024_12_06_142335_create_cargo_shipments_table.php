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
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->unsignedBigInteger('programming')->nullable();
            $table->foreign('programming')->references('id')->on('vehicle_schedules')->onDelete('cascade');
            $table->unsignedBigInteger('geofence_id')->nullable();
            $table->foreign('geofence_id')->references('id')->on('geocercas')->onDelete('set null');

            // Relación con clientes
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')->references('id')->on('personas')->onDelete('cascade');
            $table->unsignedBigInteger('conductor_id')->nullable();
            $table->foreign('conductor_id')->references('id')->on('personas')->onDelete('cascade');
            
            // Nuevos campos relevantes
            $table->decimal('peso', 10, 2); // Peso de la carga (en toneladas o kg)
            $table->string('destino'); // Destino del envío
            $table->enum('status', ['pendiente', 'en_transito', 'entregado', 'cancelado'])->default('pendiente'); // Estado del envío
            //$table->decimal('distance', 10, 2)->nullable(); // Distancia recorrida en kilómetros o metros
            $table->boolean('delete')->default(true);

            // Información adicional
            $table->timestamp('fecha_envio')->default(now()); // Fecha y hora del envío
            $table->timestamp('fecha_entrega')->nullable(); // Fecha y hora de entrega
            $table->decimal('client_latitude', 10, 8)->nullable(); // Latitud del cliente
            $table->decimal('client_longitude', 11, 8)->nullable(); // Longitud del cliente
            $table->text('notas')->nullable();
            
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
