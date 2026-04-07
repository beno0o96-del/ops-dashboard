<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class SetupAlertRecipients extends Command
{
    protected $signature = 'alerts:setup-recipients';
    protected $description = 'Setup alert recipients for expiry notifications';

    public function handle()
    {
        $this->info('Setting up alert recipients for expiry notifications...');
        
        $recipients = [];
        $this->info('Enter email addresses for expiry alert recipients (one per line, empty line to finish):');
        
        while (true) {
            $email = $this->ask('Email address');
            if (empty($email)) {
                break;
            }
            
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $recipients[] = $email;
                $this->info("Added: $email");
            } else {
                $this->error("Invalid email: $email");
            }
        }
        
        if (empty($recipients)) {
            $this->warn('No recipients added. Alerts will not be sent.');
            return Command::SUCCESS;
        }
        
        $recipientsString = implode(',', $recipients);
        Setting::updateOrCreate(
            ['key' => 'smtp_alert_recipients'],
            ['value' => $recipientsString]
        );
        
        $this->info('Alert recipients set successfully!');
        $this->info('Recipients: ' . implode(', ', $recipients));
        
        return Command::SUCCESS;
    }
}