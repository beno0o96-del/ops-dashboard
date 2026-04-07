<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Models\Housing;
use App\Models\License;
use App\Models\ExpiryAlertLog;
use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CheckExpiries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alerts:check-expiries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expiring licenses and send alerts';

    /**
     * Alert thresholds in days.
     */
    protected $thresholds = [60, 30, 15, 0];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting expiry check...');
        
        // 1. Check Employees
        $this->checkEmployees();

        // 2. Check Housings (Branches)
        $this->checkHousings();

        $this->info('Expiry check completed.');
    }

    protected function checkEmployees()
    {
        $employees = Employee::all();
        foreach ($employees as $employee) {
            // Municipality Card (كرت البلدية)
            if ($employee->municipality_card_expiry) {
                $this->processAlert(
                    $employee,
                    'municipality_card',
                    $employee->municipality_card_expiry,
                    'كرت البلدية',
                    "كرت البلدية الخاص بـ الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى تجديد كرت البلدية قبل تاريخ الانتهاء لتجنب المخالفات البلدية."
                );
            }

            // Health Training (التدريب الصحي)
            if ($employee->health_expiry) {
                $this->processAlert(
                    $employee,
                    'health_training',
                    $employee->health_expiry,
                    'التدريب الصحي',
                    "التدريب الصحي الخاص بـ الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى إعادة أو تجديد التدريب الصحي قبل تاريخ الانتهاء حسب متطلبات الجهة المختصة."
                );
            }

            // Advertisement License (تصريح اعلاني)
            if ($employee->advertisement_license_expiry) {
                $this->processAlert(
                    $employee,
                    'advertisement_license',
                    $employee->advertisement_license_expiry,
                    'تصريح اعلاني',
                    "التصريح الاعلاني الخاص بـ الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى تجديد التصريح الاعلاني قبل تاريخ الانتهاء لتجنب المخالفات."
                );
            }

            // Airport Permit (تصريح المطار)
            if ($employee->airport_permit_expiry) {
                $this->processAlert(
                    $employee,
                    'airport_permit',
                    $employee->airport_permit_expiry,
                    'تصريح المطار',
                    "تصريح المطار الخاص بـ الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى تجديد تصريح المطار قبل تاريخ الانتهاء لتجنب أي مشاكل أمنية."
                );
            }
        }
    }

    protected function checkHousings()
    {
        $housings = Housing::all();
        foreach ($housings as $housing) {
            $branchName = $housing->branch->name ?? 'غير محدد'; // Assuming 'name' is the branch/housing name

            // Municipality License (رخصة البلدية)
            if ($housing->municipality_expiry_date) {
                $this->processAlert(
                    $housing,
                    'municipality_license',
                    $housing->municipality_expiry_date,
                    'رخصة البلدية',
                    "رخصة البلدية الخاصة بفرع {$branchName}",
                    "يرجى البدء بإجراءات تجديد الرخصة قبل تاريخ الانتهاء لتجنب الإغلاق أو الغرامات."
                );
            }

            // Civil Defense Permit (تصريح الدفاع المدني)
            if ($housing->civil_defense_expiry_date) {
                $this->processAlert(
                    $housing,
                    'civil_defense_permit',
                    $housing->civil_defense_expiry_date,
                    'تصريح الدفاع المدني',
                    "تصريح الدفاع المدني الخاص بفرع {$branchName}",
                    "يرجى التأكد من تجديد التصريح واستيفاء متطلبات الدفاع المدني قبل تاريخ الانتهاء لتجنب الإيقاف."
                );
            }
        }
    }

    protected function checkLicenses()
    {
        $licenses = License::all();
        foreach ($licenses as $license) {
            $licenseName = $license->name ?? 'غير محدد'; // Assuming 'name' is the license name
            $branchName = $license->branch->name ?? 'غير محدد'; // Assuming license has a branch relationship

            // General License (رخصة عامة)
            if ($license->expiry_date) {
                $this->processAlert(
                    $license,
                    'general_license',
                    $license->expiry_date,
                    'رخصة عامة',
                    "الرخصة {$licenseName} الخاصة بفرع {$branchName}",
                    "يرجى تجديد الرخصة قبل تاريخ الانتهاء لتجنب أي تبعات قانونية أو إدارية."
                );
            }
        }
    }

    protected function processAlert($entity, $alertType, $expiryDate, $requirementName, $contextText, $actionText)
    {
        $expiry = Carbon::parse($expiryDate)->startOfDay();
        $today = Carbon::today();
        $diff = $today->diffInDays($expiry, false); // false = return negative if past
        $daysRemaining = (int) ceil($diff);

        // Check if daysRemaining matches any threshold
        // Or strictly if it's exactly one of the thresholds
        // To be safe, we check if it IS one of the thresholds.
        // If days < 0 (expired), we might want to alert too? User said 0 -> "Expired Today".
        
        if (!in_array($daysRemaining, $this->thresholds)) {
            return;
        }

        // Check if already sent
        $alreadySent = ExpiryAlertLog::where('alertable_id', $entity->id)
            ->where('alertable_type', get_class($entity))
            ->where('alert_type', $alertType)
            ->where('days_remaining', $daysRemaining)
            ->where('expiry_date', $expiry->toDateString())
            ->exists();

        if ($alreadySent) {
            return;
        }

        // Prepare Message
        $statusText = $daysRemaining === 0 ? "انتهى اليوم" : "{$daysRemaining} يوم";
        $subject = "تنبيه قرب انتهاء — {$requirementName}";
        
        $body = "تنبيه رسمي:\n\n";
        $body .= "نود إشعاركم بأن {$contextText}\n";
        $body .= "سينتهي بتاريخ: " . $expiry->format('Y-m-d') . "\n\n";
        $body .= "المتبقي على الانتهاء: {$statusText}\n\n"; // User said "0 -> انتهى اليوم"
        $body .= "{$actionText}\n\n";
        $body .= "هذا تنبيه آلي صادر من نظام OFS.\n\n";
        $body .= "في حال تم التجديد، يرجى تحديث البيانات في النظام.";

        // Determine recipients
        $recipients = [];
        if ($entity instanceof \App\Models\Employee) {
            // Check employee's specific preference for this alert type
            $preference = $entity->alertPreferences()->where('alert_type', $alertType)->first();
            if ($preference && $preference->receive_alerts) {
                $recipients[] = $entity->email;
            }
        }

        // If no specific employee recipient, or if it's not an employee entity, use general recipients
        if (empty($recipients)) {
            $recipientsStr = Setting::where('key', 'smtp_alert_recipients')->value('value');
            $generalRecipients = $recipientsStr ? array_map('trim', explode(',', $recipientsStr)) : [];
            $recipients = array_merge($recipients, $generalRecipients);
        }
        
        if (empty($recipients)) {
            $this->warn("No alert recipients configured for {$alertType} on {$entity->id}");
            return;
        }

        // Send Email
        try {
            Mail::raw($body, function ($msg) use ($recipients, $subject) {
                $msg->to($recipients)
                    ->subject($subject);
            });

            // Log Success
            ExpiryAlertLog::create([
                'alertable_id' => $entity->id,
                'alertable_type' => get_class($entity),
                'alert_type' => $alertType,
                'expiry_date' => $expiry->toDateString(),
                'days_remaining' => $daysRemaining,
                'recipients' => $recipients,
                'sent_at' => now(),
            ]);

            $this->info("Sent alert for {$alertType} on {$entity->id} ({$daysRemaining} days)");

        } catch (\Exception $e) {
            $this->error("Failed to send alert for {$alertType} on {$entity->id}: " . $e->getMessage());
            Log::error("Alert Email Failed: " . $e->getMessage());
        }
    }
}
