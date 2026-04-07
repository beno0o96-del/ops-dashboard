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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('attachable_type'); // نوع الكيان المرتبط (Branch, etc.)
            $table->unsignedBigInteger('attachable_id'); // معرف الكيان المرتبط
            $table->string('cost_center')->nullable(); // مركز التكلفة للتصفية
            $table->string('uploaded_by')->nullable(); // اسم المستخدم الذي رفع الملف
            $table->timestamps();
            
            // فهرس لتحسين الأداء
            $table->index(['attachable_type', 'attachable_id']);
            $table->index('cost_center');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};