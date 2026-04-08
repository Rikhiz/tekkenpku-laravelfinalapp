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
            $table->integer('finals')->default(0);
            $table->integer('prime')->default(0);
            $table->integer('core')->default(0);
            $table->integer('bit')->default(0);
            $table->integer('scout')->default(0);
            $table->integer('total_points')->default(0);
            $table->integer('counted_finals_events')->default(0);
            $table->integer('counted_prime_events')->default(0);
            $table->integer('counted_core_events')->default(0);
            $table->integer('counted_bit_events')->default(0);
            $table->integer('counted_scout_events')->default(0);
            $table->integer('total_finals_events')->default(0);
            $table->integer('total_prime_events')->default(0);
            $table->integer('total_core_events')->default(0);
            $table->integer('total_bit_events')->default(0);
            $table->integer('total_scout_events')->default(0);
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