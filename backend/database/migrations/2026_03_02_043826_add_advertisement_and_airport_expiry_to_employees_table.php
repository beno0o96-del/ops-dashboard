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
            $table->date('advertisement_license_expiry')->nullable()->after('health_expiry');
            $table->date('airport_permit_expiry')->nullable()->after('advertisement_license_expiry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('advertisement_license_expiry');
            $table->dropColumn('airport_permit_expiry');
        });
    }
};
