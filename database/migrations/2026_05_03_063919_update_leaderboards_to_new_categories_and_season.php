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
        Schema::table('leaderboards', function (Blueprint $table) {
            if (Schema::hasColumn('leaderboards', 'major')) $table->renameColumn('major', 'prime');
            if (Schema::hasColumn('leaderboards', 'minor')) $table->renameColumn('minor', 'core');
            if (Schema::hasColumn('leaderboards', 'mini')) $table->renameColumn('mini', 'bit');
            if (Schema::hasColumn('leaderboards', 'counted_major_events')) $table->renameColumn('counted_major_events', 'counted_prime_events');
            if (Schema::hasColumn('leaderboards', 'counted_minor_events')) $table->renameColumn('counted_minor_events', 'counted_core_events');
            if (Schema::hasColumn('leaderboards', 'counted_mini_events')) $table->renameColumn('counted_mini_events', 'counted_bit_events');
            if (Schema::hasColumn('leaderboards', 'total_major_events')) $table->renameColumn('total_major_events', 'total_prime_events');
            if (Schema::hasColumn('leaderboards', 'total_minor_events')) $table->renameColumn('total_minor_events', 'total_core_events');
            if (Schema::hasColumn('leaderboards', 'total_mini_events')) $table->renameColumn('total_mini_events', 'total_bit_events');
        });

        Schema::table('leaderboards', function (Blueprint $table) {
            if (!Schema::hasColumn('leaderboards', 'finals')) $table->integer('finals')->default(0)->after('player_name');
            if (!Schema::hasColumn('leaderboards', 'scout')) $table->integer('scout')->default(0)->after('bit');
            if (!Schema::hasColumn('leaderboards', 'counted_finals_events')) $table->integer('counted_finals_events')->default(0)->after('total_points');
            if (!Schema::hasColumn('leaderboards', 'counted_scout_events')) $table->integer('counted_scout_events')->default(0)->after('counted_bit_events');
            if (!Schema::hasColumn('leaderboards', 'total_finals_events')) $table->integer('total_finals_events')->default(0)->after('counted_scout_events');
            if (!Schema::hasColumn('leaderboards', 'total_scout_events')) $table->integer('total_scout_events')->default(0)->after('total_bit_events');
        });

        Schema::table('tournaments', function (Blueprint $table) {
            if (!Schema::hasColumn('tournaments', 'season')) {
                $table->integer('season')->nullable()->after('dojo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->renameColumn('prime', 'major');
            $table->renameColumn('core', 'minor');
            $table->renameColumn('bit', 'mini');
            $table->renameColumn('counted_prime_events', 'counted_major_events');
            $table->renameColumn('counted_core_events', 'counted_minor_events');
            $table->renameColumn('counted_bit_events', 'counted_mini_events');
            $table->renameColumn('total_prime_events', 'total_major_events');
            $table->renameColumn('total_core_events', 'total_minor_events');
            $table->renameColumn('total_bit_events', 'total_mini_events');

            $table->dropColumn([
                'finals', 'scout', 
                'counted_finals_events', 'counted_scout_events',
                'total_finals_events', 'total_scout_events'
            ]);
        });

        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn('season');
        });
    }
};
