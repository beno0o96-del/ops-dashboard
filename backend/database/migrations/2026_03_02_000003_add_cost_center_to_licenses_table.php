<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('licenses') && !Schema::hasColumn('licenses', 'cost_center')) {
            Schema::table('licenses', function (Blueprint $table) {
                $table->string('cost_center')->nullable()->after('branch');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('licenses') && Schema::hasColumn('licenses', 'cost_center')) {
            Schema::table('licenses', function (Blueprint $table) {
                $table->dropColumn('cost_center');
            });
        }
    }
};

