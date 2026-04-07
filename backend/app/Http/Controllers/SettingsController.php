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
        ];

        $values = Setting::whereIn('key', $keys)->get()->pluck('value', 'key')->toArray();
        $passwordSet = ! empty($values['mail_password']);
        $values['mail_password'] = null;
        $values['mail_password_set'] = $passwordSet;

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
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function testMail(Request $request)
    {
        $data = $request->validate([
            'to' => 'required|email|max:255',
        ]);

        try {
            Mail::raw('Test OK', function ($msg) use ($data) {
                $msg->to($data['to'])->subject('Email Test');
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
