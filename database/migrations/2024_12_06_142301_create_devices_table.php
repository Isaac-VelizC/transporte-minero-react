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
            $table->unsignedBigInteger('car_id')->nullable();
            $table->foreign('car_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->enum('status', ['activo', 'inactivo', 'en_mantenimiento']);
            //$table->string('type')->nullable();
            $table->text('description')->nullable();
            $table->decimal('last_latitude', 10, 8)->nullable();
            $table->decimal('last_longitude', 11, 8)->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->integer('update_interval')->default(60);
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
