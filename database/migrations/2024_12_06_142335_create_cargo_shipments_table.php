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
            
            // Relación con clientes
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');
            
            // Nuevos campos relevantes
            $table->decimal('peso', 10, 2); // Peso de la carga (en toneladas o kg)
            $table->string('destino'); // Destino del envío
            $table->enum('status', ['pendiente', 'en_transito', 'entregado', 'cancelado']); // Estado del envío
            
            // Información adicional
            $table->timestamp('fecha_envio')->nullable(); // Fecha y hora del envío
            $table->timestamp('fecha_entrega')->nullable(); // Fecha y hora de entrega
            $table->text('notas')->nullable(); // Notas adicionales sobre el envío
            
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
