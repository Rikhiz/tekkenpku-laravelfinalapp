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
        // Add new columns if they don't exist
        Schema::table('ban_lists', function (Blueprint $table) {
            if (!Schema::hasColumn('ban_lists', 'finals')) {
                $table->enum('finals', ['Yes', 'No'])->default('No')->after('id'); // using id since player_name doesn't exist
            }
            if (!Schema::hasColumn('ban_lists', 'scout')) {
                $table->enum('scout', ['Yes', 'No'])->default('No')->after('mini');
            }
        });

        // Rename enum columns using raw SQL to avoid Doctrine DBAL issues
        if (Schema::hasColumn('ban_lists', 'major')) {
            DB::statement("ALTER TABLE ban_lists CHANGE major prime ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }
        if (Schema::hasColumn('ban_lists', 'minor')) {
            DB::statement("ALTER TABLE ban_lists CHANGE minor core ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }
        if (Schema::hasColumn('ban_lists', 'mini')) {
            DB::statement("ALTER TABLE ban_lists CHANGE mini bit ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('ban_lists', 'prime')) {
            DB::statement("ALTER TABLE ban_lists CHANGE prime major ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }
        if (Schema::hasColumn('ban_lists', 'core')) {
            DB::statement("ALTER TABLE ban_lists CHANGE core minor ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }
        if (Schema::hasColumn('ban_lists', 'bit')) {
            DB::statement("ALTER TABLE ban_lists CHANGE bit mini ENUM('Yes', 'No') NOT NULL DEFAULT 'No'");
        }

        Schema::table('ban_lists', function (Blueprint $table) {
            $table->dropColumn(['finals', 'scout']);
        });
    }
};
