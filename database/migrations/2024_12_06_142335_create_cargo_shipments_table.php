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
            $table->json('programming')->nullable(); // Cambiar a JSON
            // Relación con clientes
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')->references('id')->on('personas')->onDelete('cascade');
            $table->unsignedBigInteger('mineral_id')->nullable();
            $table->foreign('mineral_id')->references('id')->on('tipo_minerals')->onDelete('set null');
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

            // Eliminar auto_increment de sub_total y total
            $table->integer('sub_total')->default(0);
            $table->integer('total')->default(0);

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
