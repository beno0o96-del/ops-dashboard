<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('inbox_messages')) return;
        Schema::create('inbox_messages', function (Blueprint $table) {
            $table->id();
            $table->string('from_name')->nullable();
            $table->string('from_id')->nullable();
            $table->string('from_type')->nullable();
            $table->string('to_name')->nullable();
            $table->string('to_id')->nullable();
            $table->string('to_type')->nullable();
            $table->string('title');
            $table->text('body');
            $table->string('priority')->default('normal');
            $table->string('status')->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inbox_messages');
    }
};

