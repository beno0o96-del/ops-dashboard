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
        Schema::create('violations', function (Blueprint $table) {
            $table->id();
            $table->string('branch')->index();
            $table->string('type')->index();
            $table->string('description')->nullable();
            $table->string('region')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->boolean('paid')->default(false);
            $table->boolean('archived')->default(false);
            $table->date('date')->nullable();
            $table->string('appeal_status')->default('under_study')->nullable();
            $table->string('appeal_number')->nullable();
            $table->date('appeal_date')->nullable();
            $table->date('finance_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
