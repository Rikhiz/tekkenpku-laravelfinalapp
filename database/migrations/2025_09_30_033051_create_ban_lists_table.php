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
            $table->enum('finals', ['Yes', 'No'])->default('No');
            $table->enum('prime', ['Yes', 'No'])->default('No');
            $table->enum('core', ['Yes', 'No'])->default('No');
            $table->enum('bit', ['Yes', 'No'])->default('No');
            $table->enum('scout', ['Yes', 'No'])->default('No');
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
