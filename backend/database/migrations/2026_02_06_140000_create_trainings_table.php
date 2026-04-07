<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->string('course_name')->nullable();
            $table->string('title')->nullable(); // For flexibility
            $table->date('date')->nullable();
            $table->string('trainer')->nullable();
            $table->string('branch')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
