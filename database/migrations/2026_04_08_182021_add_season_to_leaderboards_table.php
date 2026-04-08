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
            $table->integer('season')->nullable()->after('user_id');
            // Adding composite index since leaderboards will be queried per season
            $table->index(['season', 'total_points']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->dropIndex(['season', 'total_points']);
            $table->dropColumn('season');
        });
    }
};
