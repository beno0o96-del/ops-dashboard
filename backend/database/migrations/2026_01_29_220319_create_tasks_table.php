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
        // Check if table exists to avoid errors if running fresh or partial
        if (!Schema::hasTable('tasks')) {
            Schema::create('tasks', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();

                $table->enum('status', ['pending', 'in_progress', 'done'])->default('pending');
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

                $table->date('due_date')->nullable();

                $table->unsignedBigInteger('assigned_to')->nullable(); // users.id (or employees)
                $table->unsignedBigInteger('created_by')->nullable();  // users.id

                $table->timestamps();

                $table->foreign('assigned_to')->references('id')->on('users')->nullOnDelete();
                $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
