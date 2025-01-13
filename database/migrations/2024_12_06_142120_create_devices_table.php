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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('num_serial')->unique();
            $table->string('name_device')->nullable();
            $table->string('type')->nullable();
            $table->enum('status', ['activo', 'inactivo', 'asignado'])->default('activo');
            $table->decimal('last_latitude', 10, 7)->nullable();
            $table->decimal('last_longitude', 10, 7)->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
