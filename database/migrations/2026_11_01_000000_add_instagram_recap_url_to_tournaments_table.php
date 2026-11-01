<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            if (!Schema::hasColumn('tournaments', 'instagram_recap_url')) {
                $table->string('instagram_recap_url')->nullable()->after('url_ig');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            if (Schema::hasColumn('tournaments', 'instagram_recap_url')) {
                $table->dropColumn('instagram_recap_url');
            }
        });
    }
};

