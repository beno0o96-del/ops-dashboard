<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            if (!Schema::hasColumn('attachments', 'category')) {
                $table->string('category')->nullable()->after('attachable_id')->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            if (Schema::hasColumn('attachments', 'category')) {
                $table->dropColumn('category');
            }
        });
    }
};
