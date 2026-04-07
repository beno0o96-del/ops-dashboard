<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the enum column to include 'review'
        // Note: This syntax works for MySQL/MariaDB
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE tasks MODIFY COLUMN status ENUM('pending', 'in_progress', 'done', 'review') DEFAULT 'pending'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum
        // Warning: This might fail if there are 'review' tasks
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE tasks MODIFY COLUMN status ENUM('pending', 'in_progress', 'done') DEFAULT 'pending'");
        }
    }
};
