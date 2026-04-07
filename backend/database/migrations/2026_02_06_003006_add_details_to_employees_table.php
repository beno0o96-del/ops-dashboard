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
        Schema::table('employees', function (Blueprint $table) {
            $table->string('id_number')->nullable()->after('branch');
            $table->string('cost_center')->nullable()->after('id_number');
            $table->json('training_data')->nullable()->after('cost_center');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['id_number', 'cost_center', 'training_data']);
        });
    }
};
