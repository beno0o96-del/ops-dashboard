<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class SetupDefaultAlertRecipients extends Command
{
    protected $signature = 'alerts:setup-default';
    protected $description = 'Setup default alert recipients for testing';

    public function handle()
    {
        $this->info('Setting up default alert recipients...');
        
        // Set a default recipient for testing
        $defaultEmail = 'admin@example.com';
        
        Setting::updateOrCreate(
            ['key' => 'smtp_alert_recipients'],
            ['value' => $defaultEmail]
        );
        
        $this->info("Default alert recipient set: $defaultEmail");
        $this->info('You can change this later via the admin panel or by running: php artisan alerts:setup-recipients');
        
        return Command::SUCCESS;
    }
}