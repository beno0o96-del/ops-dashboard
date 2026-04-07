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
        // 1. Add municipality_card_expiry to employees
        Schema::table('employees', function (Blueprint $table) {
            if (!Schema::hasColumn('employees', 'municipality_card_expiry')) {
                $table->date('municipality_card_expiry')->nullable();
            }
        });

        // 2. Drop and Recreate expiry_alert_logs to be polymorphic
        Schema::dropIfExists('expiry_alert_logs');

        Schema::create('expiry_alert_logs', function (Blueprint $table) {
            $table->id();
            $table->morphs('alertable'); // alertable_id, alertable_type
            $table->string('alert_type', 50); // specific sub-type like 'municipality_card', 'health_training'
            $table->date('expiry_date'); // To distinguish between different renewal cycles
            $table->integer('days_remaining'); // 60, 30, 15, 0
            $table->json('recipients')->nullable();
            $table->timestamp('sent_at');
            $table->timestamps();

            // Unique constraint to prevent duplicate alerts for same entity/type/days/expiry_date
            $table->unique(['alertable_id', 'alertable_type', 'alert_type', 'days_remaining', 'expiry_date'], 'unique_alert_log');
            $table->index(['sent_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['municipality_card_expiry']);
        });

        Schema::dropIfExists('expiry_alert_logs');
        
        // Recreate old table (simplified)
        Schema::create('expiry_alert_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->string('alert_type', 50);
            $table->integer('days');
            $table->json('recipients')->nullable();
            $table->timestamp('sent_at');
            $table->timestamps();
        });
    }
};
