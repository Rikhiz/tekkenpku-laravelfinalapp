<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url_ig')->nullable();
            $table->string('image_url')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('alamat');
            $table->text('desc')->nullable();
            $table->enum('status', ['Mendatang', 'Selesai'])->default('Mendatang');
            $table->date('tanggal_kegiatan')->nullable(); // tambahan saran agar lebih informatif
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
