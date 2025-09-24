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
        // Drop existing leaderboards table if it exists and recreate it
        Schema::dropIfExists('leaderboards');
        
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('player_name');
            $table->integer('major')->default(0);
            $table->integer('minor')->default(0);
            $table->integer('mini')->default(0);
            $table->integer('total_points')->default(0);
            $table->integer('counted_major_events')->default(0);
            $table->integer('counted_minor_events')->default(0);
            $table->integer('counted_mini_events')->default(0);
            $table->integer('total_major_events')->default(0);
            $table->integer('total_minor_events')->default(0);
            $table->integer('total_mini_events')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['total_points', 'player_name']);
        });

        // Add missing columns to tournaments table if they don't exist
        if (Schema::hasTable('tournaments')) {
            Schema::table('tournaments', function (Blueprint $table) {
                if (!Schema::hasColumn('tournaments', 'tourid')) {
                    $table->string('tourid')->nullable()->after('id');
                }
                if (!Schema::hasColumn('tournaments', 'category')) {
                    $table->integer('category')->default(3)->after('total'); // 1=major, 2=minor, 3=mini
                }
            });
        }

        // Create relasitour table if it doesn't exist
        if (!Schema::hasTable('relasitour')) {
            Schema::create('relasitour', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('tourid'); // This should match tournaments.tourid
                $table->integer('placement');
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->unique(['user_id', 'tourid']); // Prevent duplicate entries
                $table->index(['tourid', 'placement']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relasitour');
        
        if (Schema::hasTable('tournaments')) {
            Schema::table('tournaments', function (Blueprint $table) {
                if (Schema::hasColumn('tournaments', 'tourid')) {
                    $table->dropColumn('tourid');
                }
                if (Schema::hasColumn('tournaments', 'category')) {
                    $table->dropColumn('category');
                }
            });
        }

        Schema::dropIfExists('leaderboards');
    }
};