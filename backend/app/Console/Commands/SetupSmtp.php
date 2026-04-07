<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class SetupSmtp extends Command
{
    protected $signature = 'smtp:setup {--gmail : Use Gmail SMTP settings}';
    protected $description = 'Setup SMTP configuration';

    public function handle()
    {
        $this->info('Setting up SMTP configuration...');

        if ($this->option('gmail')) {
            $this->setupGmail();
        } else {
            $this->setupCustom();
        }

        $this->info('SMTP configuration completed!');
        return Command::SUCCESS;
    }

    private function setupGmail()
    {
        $this->info('Setting up Gmail SMTP...');
        
        $settings = [
            'mail_mailer' => 'smtp',
            'mail_host' => 'smtp.gmail.com',
            'mail_port' => 587,
            'mail_encryption' => 'tls',
            'mail_from_address' => $this->ask('Enter your Gmail address'),
            'mail_from_name' => $this->ask('Enter sender name (default: OFS System)', 'OFS System'),
        ];

        $username = $this->ask('Enter your Gmail address for SMTP username', $settings['mail_from_address']);
        $settings['mail_username'] = $username;

        $this->setSettings($settings);
        
        $this->warn('⚠️  Important: For Gmail, you need to use an "App Password" instead of your regular password.');
        $this->warn('   Create one at: https://myaccount.google.com/apppasswords');
        $this->warn('   Then set the password using: php artisan tinker');
        $this->warn('   Setting::where("key", "mail_password")->update(["value" => "your-app-password"]);');
    }

    private function setupCustom()
    {
        $this->info('Setting up custom SMTP...');
        
        $settings = [
            'mail_mailer' => 'smtp',
            'mail_host' => $this->ask('SMTP Host', 'smtp.example.com'),
            'mail_port' => $this->ask('SMTP Port', 587),
            'mail_encryption' => $this->choice('Encryption', ['tls', 'ssl', 'none'], 'tls'),
            'mail_from_address' => $this->ask('From Email Address'),
            'mail_from_name' => $this->ask('From Name', 'OFS System'),
            'mail_username' => $this->ask('SMTP Username'),
        ];

        $this->setSettings($settings);
        
        $password = $this->secret('SMTP Password');
        if ($password) {
            Setting::updateOrCreate(['key' => 'mail_password'], ['value' => $password]);
            $this->info('Password set successfully!');
        }
    }

    private function setSettings(array $settings)
    {
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            $this->info("Set $key: $value");
        }
    }
}