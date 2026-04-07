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
            if (!Schema::hasColumn('employees', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->index();
            }
            if (!Schema::hasColumn('employees', 'tcoe_expiry')) {
                $table->date('tcoe_expiry')->nullable();
            }
            if (!Schema::hasColumn('employees', 'health_expiry')) {
                $table->date('health_expiry')->nullable();
            }
            if (!Schema::hasColumn('employees', 'airport_expiry')) {
                $table->date('airport_expiry')->nullable();
            }
        });

        Schema::table('trainings', function (Blueprint $table) {
            if (!Schema::hasColumn('trainings', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->index();
            }
            if (!Schema::hasColumn('trainings', 'cost_center')) {
                $table->string('cost_center')->nullable()->index();
            }
        });

        Schema::table('transports', function (Blueprint $table) {
            if (!Schema::hasColumn('transports', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->index();
            }
            if (!Schema::hasColumn('transports', 'cost_center')) {
                $table->string('cost_center')->nullable()->index();
            }
        });

        Schema::table('housings', function (Blueprint $table) {
            if (!Schema::hasColumn('housings', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->index();
            }
            // housings might already have cost_centers (array), but singular is useful for main linking
            if (!Schema::hasColumn('housings', 'cost_center')) {
                $table->string('cost_center')->nullable()->index();
            }
        });

        Schema::table('licenses', function (Blueprint $table) {
            if (!Schema::hasColumn('licenses', 'cost_center')) {
                $table->string('cost_center')->nullable()->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['branch_id', 'tcoe_expiry', 'health_expiry', 'airport_expiry']);
        });
        Schema::table('trainings', function (Blueprint $table) {
            $table->dropColumn(['branch_id', 'cost_center']);
        });
        Schema::table('transports', function (Blueprint $table) {
            $table->dropColumn(['branch_id', 'cost_center']);
        });
        Schema::table('housings', function (Blueprint $table) {
            $table->dropColumn(['branch_id', 'cost_center']);
        });
        Schema::table('licenses', function (Blueprint $table) {
            $table->dropColumn(['cost_center']);
        });
    }
};
