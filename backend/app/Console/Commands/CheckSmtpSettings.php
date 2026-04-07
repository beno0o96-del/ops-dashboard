<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class CheckSmtpSettings extends Command
{
    protected $signature = 'smtp:check';
    protected $description = 'Check current SMTP settings';

    public function handle()
    {
        $settings = Setting::whereIn('key', [
            'mail_mailer',
            'mail_host', 
            'mail_port',
            'mail_username',
            'mail_encryption',
            'mail_from_address',
            'smtp_alert_recipients'
        ])->pluck('value', 'key')->toArray();

        $this->info('Current SMTP Settings:');
        $this->info('====================');
        foreach ($settings as $key => $value) {
            if ($key === 'mail_password') {
                $this->info("$key: [HIDDEN]");
            } else {
                $this->info("$key: " . ($value ?: 'NOT SET'));
            }
        }

        $this->info('');
        $this->info('Missing settings:');
        $required = ['mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_encryption', 'mail_from_address'];
        foreach ($required as $key) {
            if (!isset($settings[$key]) || empty($settings[$key])) {
                $this->warn("- $key");
            }
        }

        return Command::SUCCESS;
    }
}