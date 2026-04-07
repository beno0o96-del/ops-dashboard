<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('housings', function (Blueprint $table) {
            if (!Schema::hasColumn('housings', 'city')) {
                $table->string('city')->nullable()->after('location');
            }
            if (!Schema::hasColumn('housings', 'supervisor')) {
                $table->string('supervisor')->nullable()->after('city');
            }
            if (!Schema::hasColumn('housings', 'rooms_count')) {
                $table->integer('rooms_count')->nullable()->after('supervisor');
            }
            if (!Schema::hasColumn('housings', 'beds_capacity')) {
                $table->integer('beds_capacity')->nullable()->after('rooms_count');
            }
            if (!Schema::hasColumn('housings', 'occupants_count')) {
                $table->integer('occupants_count')->nullable()->after('beds_capacity');
            }
            if (!Schema::hasColumn('housings', 'monthly_expense_total')) {
                $table->decimal('monthly_expense_total', 12, 2)->nullable()->default(0)->after('occupants_count');
            }
            if (!Schema::hasColumn('housings', 'municipality_expiry_days')) {
                $table->integer('municipality_expiry_days')->nullable()->after('monthly_expense_total');
            }
            if (!Schema::hasColumn('housings', 'civil_defense_expiry_days')) {
                $table->integer('civil_defense_expiry_days')->nullable()->after('municipality_expiry_days');
            }
            if (!Schema::hasColumn('housings', 'cost_centers')) {
                $table->json('cost_centers')->nullable()->after('civil_defense_expiry_days');
            }
            if (!Schema::hasColumn('housings', 'image')) {
                $table->text('image')->nullable()->after('cost_centers');
            }
            if (!Schema::hasColumn('housings', 'image_data')) {
                $table->longText('image_data')->nullable()->after('image');
            }
            if (!Schema::hasColumn('housings', 'assigned_employees')) {
                $table->json('assigned_employees')->nullable()->after('image_data');
            }
        });
    }

    public function down(): void
    {
        Schema::table('housings', function (Blueprint $table) {
            if (Schema::hasColumn('housings', 'assigned_employees')) {
                $table->dropColumn('assigned_employees');
            }
            if (Schema::hasColumn('housings', 'image_data')) {
                $table->dropColumn('image_data');
            }
            if (Schema::hasColumn('housings', 'image')) {
                $table->dropColumn('image');
            }
            if (Schema::hasColumn('housings', 'cost_centers')) {
                $table->dropColumn('cost_centers');
            }
            if (Schema::hasColumn('housings', 'civil_defense_expiry_days')) {
                $table->dropColumn('civil_defense_expiry_days');
            }
            if (Schema::hasColumn('housings', 'municipality_expiry_days')) {
                $table->dropColumn('municipality_expiry_days');
            }
            if (Schema::hasColumn('housings', 'monthly_expense_total')) {
                $table->dropColumn('monthly_expense_total');
            }
            if (Schema::hasColumn('housings', 'occupants_count')) {
                $table->dropColumn('occupants_count');
            }
            if (Schema::hasColumn('housings', 'beds_capacity')) {
                $table->dropColumn('beds_capacity');
            }
            if (Schema::hasColumn('housings', 'rooms_count')) {
                $table->dropColumn('rooms_count');
            }
            if (Schema::hasColumn('housings', 'supervisor')) {
                $table->dropColumn('supervisor');
            }
            if (Schema::hasColumn('housings', 'city')) {
                $table->dropColumn('city');
            }
        });
    }
};

