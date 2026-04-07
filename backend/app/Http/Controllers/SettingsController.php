<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SettingsController extends Controller
{
    public function index()
    {
        $keys = [
            'mail_mailer',
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_encryption',
            'mail_from_address',
            'mail_from_name',
            'alert_recipients',
            'smtp_alert_recipients',
            'alert_templates_json',
            'alert_threshold_days',
            'alert_manual_recipients',
        ];

        $values = Setting::whereIn('key', $keys)->get()->pluck('value', 'key')->toArray();
        $passwordSet = ! empty($values['mail_password']);
        $values['mail_password'] = null;
        $values['mail_password_set'] = $passwordSet;
        if (empty($values['alert_recipients']) && ! empty($values['smtp_alert_recipients'])) {
            $values['alert_recipients'] = $values['smtp_alert_recipients'];
        }
        if (empty($values['smtp_alert_recipients']) && ! empty($values['alert_recipients'])) {
            $values['smtp_alert_recipients'] = $values['alert_recipients'];
        }

        foreach ($keys as $k) {
            if (! array_key_exists($k, $values)) {
                $values[$k] = null;
            }
        }

        return $values;
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'mail_mailer' => 'sometimes|nullable|string|max:50',
            'mail_host' => 'sometimes|nullable|string|max:255',
            'mail_port' => 'sometimes|nullable|integer|min:1|max:65535',
            'mail_username' => 'sometimes|nullable|string|max:255',
            'mail_password' => 'sometimes|nullable|string|max:255',
            'mail_encryption' => 'sometimes|nullable|string|max:20',
            'mail_from_address' => 'sometimes|nullable|email|max:255',
            'mail_from_name' => 'sometimes|nullable|string|max:255',
            'alert_recipients' => 'sometimes|nullable|string|max:2000',
            'alert_templates_json' => 'sometimes|nullable|string|max:200000',
            'alert_threshold_days' => 'sometimes|nullable|string|max:100',
            'alert_manual_recipients' => 'sometimes|nullable|string|max:5000',
        ]);

        foreach ($data as $key => $value) {
            if ($key === 'mail_encryption') {
                $value = $value ? strtolower(trim($value)) : null;
                if ($value === 'none') {
                    $value = null;
                }
            }
            if ($key === 'mail_mailer') {
                $value = $value ? strtolower(trim($value)) : null;
            }
            if ($key === 'mail_password') {
                if ($value === '') {
                    $value = null;
                }
            }

            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            if ($key === 'alert_recipients') {
                Setting::updateOrCreate(['key' => 'smtp_alert_recipients'], ['value' => $value]);
            }
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function testMail(Request $request)
    {
        $data = $request->validate([
            'to' => 'required|string|max:2000',
            'message' => 'sometimes|nullable|string|max:5000',
            'attachments' => 'sometimes|array',
            'attachments.*' => 'file|max:51200',
        ]);

        $rawTo = trim((string) ($data['to'] ?? ''));
        $rawTo = str_replace(["،", ";"], ',', $rawTo);
        preg_match_all('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $rawTo, $matches);
        $emails = array_values(array_unique(array_map(function ($email) {
            return strtolower(trim((string) $email));
        }, $matches[0] ?? [])));
        if (empty($emails) && preg_match('/<([^>]+)>/', $rawTo, $m)) {
            $candidate = trim((string) ($m[1] ?? ''));
            if (filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
                $emails[] = strtolower($candidate);
            }
        }
        if (empty($emails)) {
            return response()->json([
                'message' => 'failed',
                'error' => 'صيغة بريد المستقبل غير صحيحة',
            ], 422);
        }

        $body = trim((string) ($data['message'] ?? ''));
        if ($body === '') {
            $body = 'Test OK';
        }
        $attachments = $request->file('attachments', []);

        try {
            Mail::raw($body, function ($msg) use ($emails, $attachments) {
                $msg->to($emails)->subject('Email Test');
                foreach ($attachments as $file) {
                    $msg->attach($file->getRealPath(), [
                        'as' => $file->getClientOriginalName(),
                        'mime' => $file->getMimeType(),
                    ]);
                }
            });
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['message' => 'sent']);
    }
}
