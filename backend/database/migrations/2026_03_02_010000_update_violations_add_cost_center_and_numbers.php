<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            if (!Schema::hasColumn('violations', 'cost_center')) {
                // SQLite لا يسمح بإضافة عمود NOT NULL دون قيمة افتراضية
                // لذلك نجعلها قابلة للإفراغ هنا، ونتحقق بالتطبيق
                $table->string('cost_center')->nullable()->after('branch');
                $table->index('cost_center');
            }
            if (!Schema::hasColumn('violations', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('cost_center');
                $table->index('branch_id');
            }
            if (!Schema::hasColumn('violations', 'vio_no')) {
                $table->string('vio_no')->nullable()->after('region');
            }
            if (!Schema::hasColumn('violations', 'efaa_no')) {
                $table->string('efaa_no')->nullable()->after('vio_no');
            }
            if (!Schema::hasColumn('violations', 'payment_no')) {
                $table->string('payment_no')->nullable()->after('efaa_no');
            }
        });
    }

    public function down(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            if (Schema::hasColumn('violations', 'payment_no')) {
                $table->dropColumn('payment_no');
            }
            if (Schema::hasColumn('violations', 'efaa_no')) {
                $table->dropColumn('efaa_no');
            }
            if (Schema::hasColumn('violations', 'vio_no')) {
                $table->dropColumn('vio_no');
            }
            if (Schema::hasColumn('violations', 'branch_id')) {
                $table->dropIndex(['branch_id']);
                $table->dropColumn('branch_id');
            }
            if (Schema::hasColumn('violations', 'cost_center')) {
                $table->dropIndex(['cost_center']);
                $table->dropColumn('cost_center');
            }
        });
    }
};
