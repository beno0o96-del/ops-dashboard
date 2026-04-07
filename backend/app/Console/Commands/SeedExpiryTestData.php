<?php

namespace App\Console\Commands;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Housing;
use App\Models\License;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SeedExpiryTestData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-expiry-test-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seeds test data for expiry alerts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Seeding expiry test data...');

        // 1. Create a Branch
        $branch = Branch::firstOrCreate(
            ['name' => 'Test Branch'],
            ['city' => 'Test City']
        );
        $this->info("Created/Found Branch: {$branch->name} (ID: {$branch->id})");

        // 2. Create an Employee with expiring documents
        $employee = Employee::firstOrCreate(
            ['name' => 'Test Employee', 'email' => 'test.employee@example.com'],
            [
                'branch_id' => $branch->id,
                'municipality_card_expiry' => Carbon::now()->addDays(15)->toDateString(), // Expires in 15 days
                'health_expiry' => Carbon::now()->addDays(30)->toDateString(), // Expires in 30 days
            ]
        );
        $this->info("Created/Found Employee: {$employee->name} (ID: {$employee->id})");

        // 3. Create a Housing with expiring licenses
        $housing = Housing::firstOrCreate(
            ['name' => 'Test Housing'],
            [
                'branch_id' => $branch->id,
                'municipality_expiry_date' => Carbon::now()->addDays(60)->toDateString(), // Expires in 60 days
                'civil_defense_expiry_date' => Carbon::now()->addDays(0)->toDateString(), // Expires today
            ]
        );
        $this->info("Created/Found Housing: {$housing->name} (ID: {$housing->id})");

        // 4. Create a License
        $license = License::firstOrCreate(
            ['title' => 'Test License', 'license_no' => 'LIC-001'],
            [
                'branch_id' => $branch->id,
                'expiry_date' => Carbon::now()->addDays(15)->toDateString(), // Expires in 15 days
            ]
        );
        $this->info("Created/Found License: {$license->title} (ID: {$license->id})");

        // 5. Set alert recipients
        Setting::updateOrCreate(
            ['key' => 'smtp_alert_recipients'],
            ['value' => 'enjaz1406@gmail.com']
        );
        $this->info('Set smtp_alert_recipients to enjaz1406@gmail.com');

        $this->info('Expiry test data seeding completed.');
    }
}
