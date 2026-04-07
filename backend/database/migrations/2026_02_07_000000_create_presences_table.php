<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->string('username')->index();
            $table->string('role')->nullable();
            $table->timestamp('last_seen_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
