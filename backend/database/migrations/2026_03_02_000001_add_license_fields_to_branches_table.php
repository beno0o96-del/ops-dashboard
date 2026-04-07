<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('store_license')->nullable();
            $table->date('store_license_expiry')->nullable();
            $table->string('civil_defense')->nullable();
            $table->date('civil_defense_expiry')->nullable();
            $table->string('permit_24h')->nullable();
            $table->date('permit_24h_expiry')->nullable();
            $table->string('delivery_permit')->nullable();
            $table->date('delivery_permit_expiry')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn([
                'store_license', 'store_license_expiry',
                'civil_defense', 'civil_defense_expiry',
                'permit_24h', 'permit_24h_expiry',
                'delivery_permit', 'delivery_permit_expiry'
            ]);
        });
    }
};