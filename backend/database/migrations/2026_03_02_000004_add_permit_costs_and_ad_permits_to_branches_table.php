<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('permit_24h_cost')->nullable();
            $table->string('delivery_permit_cost')->nullable();

            $table->boolean('vertical_sign_exists')->default(false);
            $table->string('vertical_sign_length')->nullable();
            $table->string('vertical_sign_width')->nullable();
            $table->string('vertical_sign_unit')->nullable();

            $table->string('outdoor_permit')->nullable();
            $table->date('outdoor_permit_expiry')->nullable();
            $table->string('outdoor_area')->nullable();
            $table->string('outdoor_permit_cost')->nullable();

            $table->json('ad_permits')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn([
                'permit_24h_cost',
                'delivery_permit_cost',
                'vertical_sign_exists',
                'vertical_sign_length',
                'vertical_sign_width',
                'vertical_sign_unit',
                'outdoor_permit',
                'outdoor_permit_expiry',
                'outdoor_area',
                'outdoor_permit_cost',
                'ad_permits',
            ]);
        });
    }
};
