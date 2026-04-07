<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('type')->default('basic')->nullable();
            $table->string('brand')->nullable();
            $table->string('email')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('ops1')->nullable();
            $table->decimal('kpi_target', 10, 2)->default(0);
            $table->decimal('kpi_value', 10, 2)->default(0);
            $table->decimal('kpi_score', 5, 2)->default(0);
            $table->date('opening_date_expected')->nullable();
            $table->date('close_date')->nullable();
            $table->string('region')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('hidden')->default(false);
            $table->boolean('award_star_manual')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn([
                'type', 'brand', 'email', 'cost_center', 'ops1',
                'kpi_target', 'kpi_value', 'kpi_score',
                'opening_date_expected', 'close_date',
                'region', 'notes', 'hidden', 'award_star_manual'
            ]);
        });
    }
};
