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
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nombre', 100); // Aumentado a 100 caracteres
            $table->string('ap_pat', 100); // Aumentado a 100 caracteres
            $table->string('ap_mat', 100)->nullable(); // Aumentado a 100 caracteres
            $table->string('ci')->unique();
            $table->enum('genero', ['Hombre', 'Mujer', 'Otro']);
            $table->string('numero')->unique()->nullable();
            //$table->string('avatar', 255)->default('user.png');
            $table->boolean('estado')->default(true);
            $table->string('rol')->default('Cliente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
