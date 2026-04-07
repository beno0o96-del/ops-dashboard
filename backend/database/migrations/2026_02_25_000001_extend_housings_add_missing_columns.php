<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('housings', function (Blueprint $table) {
            if (!Schema::hasColumn('housings', 'city')) $table->string('city')->nullable()->after('location');
            if (!Schema::hasColumn('housings', 'supervisor')) $table->string('supervisor')->nullable()->after('city');
            if (!Schema::hasColumn('housings', 'rooms_count')) $table->integer('rooms_count')->nullable()->after('capacity');
            if (!Schema::hasColumn('housings', 'beds_capacity')) $table->integer('beds_capacity')->nullable()->after('rooms_count');
            if (!Schema::hasColumn('housings', 'occupants_count')) $table->integer('occupants_count')->nullable()->default(0)->after('beds_capacity');

            if (!Schema::hasColumn('housings', 'monthly_expense_total')) $table->decimal('monthly_expense_total', 12, 2)->nullable()->after('notes');
            if (!Schema::hasColumn('housings', 'monthly_expenses')) $table->decimal('monthly_expenses', 12, 2)->nullable()->after('monthly_expense_total');
            if (!Schema::hasColumn('housings', 'expenses')) $table->json('expenses')->nullable()->after('monthly_expenses');

            if (!Schema::hasColumn('housings', 'municipality_license_number')) $table->string('municipality_license_number')->nullable()->after('notes');
            if (!Schema::hasColumn('housings', 'municipality_expiry_date')) $table->date('municipality_expiry_date')->nullable()->after('municipality_license_number');
            if (!Schema::hasColumn('housings', 'municipality_expiry_days')) $table->integer('municipality_expiry_days')->nullable()->after('municipality_expiry_date');

            if (!Schema::hasColumn('housings', 'civil_defense_license_number')) $table->string('civil_defense_license_number')->nullable()->after('municipality_expiry_days');
            if (!Schema::hasColumn('housings', 'civil_defense_expiry_date')) $table->date('civil_defense_expiry_date')->nullable()->after('civil_defense_license_number');
            if (!Schema::hasColumn('housings', 'civil_defense_expiry_days')) $table->integer('civil_defense_expiry_days')->nullable()->after('civil_defense_expiry_date');
            if (!Schema::hasColumn('housings', 'civil_defense_status')) $table->string('civil_defense_status')->nullable()->after('civil_defense_expiry_days');

            if (!Schema::hasColumn('housings', 'cost_centers')) $table->json('cost_centers')->nullable()->after('civil_defense_status');

            if (!Schema::hasColumn('housings', 'image')) $table->string('image')->nullable()->after('cost_centers');
            if (!Schema::hasColumn('housings', 'image_data')) $table->text('image_data')->nullable()->after('image');
            if (!Schema::hasColumn('housings', 'images')) $table->json('images')->nullable()->after('image_data');
            if (!Schema::hasColumn('housings', 'images_data')) $table->json('images_data')->nullable()->after('images');

            if (!Schema::hasColumn('housings', 'assigned_employees')) $table->json('assigned_employees')->nullable()->after('images_data');
        });
    }

    public function down(): void
    {
        Schema::table('housings', function (Blueprint $table) {
            $cols = [
                'city','supervisor','rooms_count','beds_capacity','occupants_count',
                'monthly_expense_total','monthly_expenses','expenses',
                'municipality_license_number','municipality_expiry_date','municipality_expiry_days',
                'civil_defense_license_number','civil_defense_expiry_date','civil_defense_expiry_days','civil_defense_status',
                'cost_centers','image','image_data','images','images_data','assigned_employees'
            ];
            foreach ($cols as $c) {
                if (Schema::hasColumn('housings', $c)) {
                    $table->dropColumn($c);
                }
            }
        });
    }
};

