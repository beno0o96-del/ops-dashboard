<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin-only', function ($user) {
            return $user->role === 'admin'; // أو is_admin
        });

        try {
            if (Schema::hasTable('settings')) {
                $settings = Setting::whereIn('key', [
                    'mail_mailer',
                    'mail_host',
                    'mail_port',
                    'mail_username',
                    'mail_password',
                    'mail_encryption',
                    'mail_from_address',
                    'mail_from_name',
                ])->get()->pluck('value', 'key')->toArray();

                if (! empty($settings['mail_mailer'])) {
                    config(['mail.default' => strtolower($settings['mail_mailer'])]);
                }
                if (! empty($settings['mail_host'])) {
                    config(['mail.mailers.smtp.host' => $settings['mail_host']]);
                }
                if (! empty($settings['mail_port'])) {
                    config(['mail.mailers.smtp.port' => (int) $settings['mail_port']]);
                }
                if (! empty($settings['mail_username'])) {
                    config(['mail.mailers.smtp.username' => $settings['mail_username']]);
                }
                if (! empty($settings['mail_password'])) {
                    config(['mail.mailers.smtp.password' => $settings['mail_password']]);
                }
                if (array_key_exists('mail_encryption', $settings)) {
                    $enc = $settings['mail_encryption'] ? strtolower(trim($settings['mail_encryption'])) : null;
                    if ($enc === 'ssl') {
                        config(['mail.mailers.smtp.scheme' => 'smtps']);
                    } else {
                        config(['mail.mailers.smtp.scheme' => 'smtp']);
                    }
                }
                if (! empty($settings['mail_from_address'])) {
                    config(['mail.from.address' => $settings['mail_from_address']]);
                }
                if (! empty($settings['mail_from_name'])) {
                    config(['mail.from.name' => $settings['mail_from_name']]);
                }
            }
        } catch (\Exception $e) {
            // Log or ignore
        }
    }
}
