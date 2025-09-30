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
        Schema::create('ban_lists', function (Blueprint $table) {
            $table->id();
            $table->enum('major', ['Yes', 'No'])->default('No');
            $table->enum('minor', ['Yes', 'No'])->default('No');
            $table->enum('mini', ['Yes', 'No'])->default('No');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ban_lists');
    }
};
