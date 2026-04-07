<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('expiry_alert_logs')) {
            return;
        }

        Schema::create('expiry_alert_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->string('alert_type', 50);
            $table->integer('days');
            $table->json('recipients')->nullable();
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->unique(['employee_id', 'alert_type', 'days']);
            $table->index(['sent_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expiry_alert_logs');
    }
};
