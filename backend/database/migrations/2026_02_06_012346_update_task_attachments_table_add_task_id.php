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
        Schema::table('task_attachments', function (Blueprint $table) {
            $table->foreignId('task_comment_id')->nullable()->change();
            $table->foreignId('task_id')->nullable()->after('task_comment_id')->constrained('tasks')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_attachments', function (Blueprint $table) {
            $table->foreignId('task_comment_id')->nullable(false)->change();
            $table->dropForeign(['task_id']);
            $table->dropColumn('task_id');
        });
    }
};
