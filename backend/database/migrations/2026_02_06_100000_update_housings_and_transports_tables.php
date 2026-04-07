<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update Housings Table
        Schema::table('housings', function (Blueprint $table) {
            $table->string('type')->nullable()->after('capacity');
            $table->decimal('rent_amount', 10, 2)->nullable()->after('type');
            $table->string('owner')->nullable()->after('rent_amount');
            $table->string('contact_phone')->nullable()->after('owner');
            $table->string('status')->default('available')->after('contact_phone');
            $table->text('notes')->nullable()->after('status');
        });

        // Update Transports Table
        Schema::table('transports', function (Blueprint $table) {
            // Rename columns to match user expectations
            // Note: We check if they exist first to avoid errors if re-running
            
            // If 'plate' exists and 'plate_number' doesn't, rename it
            if (Schema::hasColumn('transports', 'plate') && !Schema::hasColumn('transports', 'plate_number')) {
                $table->renameColumn('plate', 'plate_number');
            }
            
            // If 'model' exists and 'type' doesn't, rename it
            if (Schema::hasColumn('transports', 'model') && !Schema::hasColumn('transports', 'type')) {
                $table->renameColumn('model', 'type');
            }

            // Add new columns
            if (!Schema::hasColumn('transports', 'capacity')) {
                $table->integer('capacity')->nullable()->after('id');
            }
            
            if (!Schema::hasColumn('transports', 'notes')) {
                $table->text('notes')->nullable()->after('updated_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('housings', function (Blueprint $table) {
            $table->dropColumn(['type', 'rent_amount', 'owner', 'contact_phone', 'status', 'notes']);
        });

        Schema::table('transports', function (Blueprint $table) {
            $table->dropColumn(['capacity', 'notes']);
            $table->renameColumn('plate_number', 'plate');
            $table->renameColumn('type', 'model');
        });
    }
};
