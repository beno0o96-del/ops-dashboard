<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('licenses', function (Blueprint $table) {
            if (Schema::hasColumn('licenses', 'name')) {
                $table->renameColumn('name', 'title');
            } else {
                $table->string('title')->nullable();
            }
            if (Schema::hasColumn('licenses', 'expire_date')) {
                $table->renameColumn('expire_date', 'expiry_date');
            } else {
                $table->date('expiry_date')->nullable();
            }
            if (Schema::hasColumn('licenses', 'branch')) {
                $table->dropColumn('branch');
            }
            if (!Schema::hasColumn('licenses', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
                $table->index('branch_id');
            }
            if (!Schema::hasColumn('licenses', 'type')) {
                $table->string('type')->nullable()->after('branch_id');
            }
            if (!Schema::hasColumn('licenses', 'license_no')) {
                $table->string('license_no')->nullable();
            }
            if (!Schema::hasColumn('licenses', 'issue_date')) {
                $table->date('issue_date')->nullable();
            }
            if (!Schema::hasColumn('licenses', 'status')) {
                $table->string('status')->nullable();
            }
            if (!Schema::hasColumn('licenses', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (Schema::hasColumn('licenses', 'archived')) {
                $table->dropColumn('archived');
            }
            if (!Schema::hasColumn('licenses', 'archived_at')) {
                $table->timestamp('archived_at')->nullable()->index();
            }
            if (!Schema::hasColumn('licenses', 'archive_reason')) {
                $table->string('archive_reason')->nullable();
            }
        });

        Schema::table('contracts', function (Blueprint $table) {
            if (Schema::hasColumn('contracts', 'name')) {
                $table->renameColumn('name', 'title');
            } else {
                $table->string('title')->nullable();
            }
            if (Schema::hasColumn('contracts', 'expire_date')) {
                $table->renameColumn('expire_date', 'expiry_date');
            } else {
                $table->date('expiry_date')->nullable();
            }
            if (Schema::hasColumn('contracts', 'branch')) {
                $table->dropColumn('branch');
            }
            if (!Schema::hasColumn('contracts', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
                $table->index('branch_id');
            }
            if (!Schema::hasColumn('contracts', 'type')) {
                $table->string('type')->nullable()->after('branch_id');
            }
            if (!Schema::hasColumn('contracts', 'vendor_name')) {
                $table->string('vendor_name')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'contract_no')) {
                $table->string('contract_no')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'start_date')) {
                $table->date('start_date')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'value')) {
                $table->decimal('value', 12, 2)->nullable();
            }
            if (!Schema::hasColumn('contracts', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (Schema::hasColumn('contracts', 'archived')) {
                $table->dropColumn('archived');
            }
            if (!Schema::hasColumn('contracts', 'archived_at')) {
                $table->timestamp('archived_at')->nullable()->index();
            }
            if (!Schema::hasColumn('contracts', 'archive_reason')) {
                $table->string('archive_reason')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('licenses', function (Blueprint $table) {
            if (Schema::hasColumn('licenses', 'title')) {
                $table->renameColumn('title', 'name');
            }
            if (Schema::hasColumn('licenses', 'expiry_date')) {
                $table->renameColumn('expiry_date', 'expire_date');
            }
            if (Schema::hasColumn('licenses', 'branch_id')) {
                $table->dropColumn('branch_id');
            }
            if (Schema::hasColumn('licenses', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('licenses', 'license_no')) {
                $table->dropColumn('license_no');
            }
            if (Schema::hasColumn('licenses', 'issue_date')) {
                $table->dropColumn('issue_date');
            }
            if (Schema::hasColumn('licenses', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('licenses', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('licenses', 'archived_at')) {
                $table->dropColumn('archived_at');
            }
            if (Schema::hasColumn('licenses', 'archive_reason')) {
                $table->dropColumn('archive_reason');
            }
            if (!Schema::hasColumn('licenses', 'branch')) {
                $table->string('branch')->nullable();
            }
            if (!Schema::hasColumn('licenses', 'archived')) {
                $table->boolean('archived')->default(false);
            }
        });

        Schema::table('contracts', function (Blueprint $table) {
            if (Schema::hasColumn('contracts', 'title')) {
                $table->renameColumn('title', 'name');
            }
            if (Schema::hasColumn('contracts', 'expiry_date')) {
                $table->renameColumn('expiry_date', 'expire_date');
            }
            if (Schema::hasColumn('contracts', 'branch_id')) {
                $table->dropColumn('branch_id');
            }
            if (Schema::hasColumn('contracts', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('contracts', 'vendor_name')) {
                $table->dropColumn('vendor_name');
            }
            if (Schema::hasColumn('contracts', 'contract_no')) {
                $table->dropColumn('contract_no');
            }
            if (Schema::hasColumn('contracts', 'start_date')) {
                $table->dropColumn('start_date');
            }
            if (Schema::hasColumn('contracts', 'value')) {
                $table->dropColumn('value');
            }
            if (Schema::hasColumn('contracts', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('contracts', 'archived_at')) {
                $table->dropColumn('archived_at');
            }
            if (Schema::hasColumn('contracts', 'archive_reason')) {
                $table->dropColumn('archive_reason');
            }
            if (!Schema::hasColumn('contracts', 'branch')) {
                $table->string('branch')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'archived')) {
                $table->boolean('archived')->default(false);
            }
        });
    }
};
