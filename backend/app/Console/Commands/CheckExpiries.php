<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Models\Branch;
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
    protected $thresholds = null;
    protected $alertTemplates = null;

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
        $this->checkBranches();

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
            if ($employee->tcoe_expiry) {
                $this->processAlert(
                    $employee,
                    'tcoe_expiry',
                    $employee->tcoe_expiry,
                    'التدريب العملي T.C.O.E',
                    "التدريب العملي الخاص بـ الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى تحديث أو تجديد التدريب العملي قبل تاريخ الانتهاء حسب متطلبات الجهة المختصة."
                );
            }
            $permitExpiry = data_get($employee, 'permit_expiry');
            if ($permitExpiry) {
                $this->processAlert(
                    $employee,
                    'permit_expiry_date',
                    $permitExpiry,
                    'تاريخ الانتهاء',
                    "تصريح الموظف {$employee->name} في فرع " . ($employee->branch->name ?? 'غير محدد'),
                    "يرجى مراجعة التصريح واتخاذ الإجراء اللازم قبل تاريخ الانتهاء لتجنب المخالفات."
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

    protected function checkBranches()
    {
        $branches = Branch::all();
        foreach ($branches as $branch) {
            $branchName = $branch->name ?? 'غير محدد';
            if ($branch->store_license_expiry) {
                $this->processAlert(
                    $branch,
                    'municipality_license',
                    $branch->store_license_expiry,
                    'رخصة البلدية',
                    "رخصة البلدية الخاصة بفرع {$branchName}",
                    "يرجى البدء بإجراءات تجديد الرخصة قبل تاريخ الانتهاء لتجنب الإغلاق أو الغرامات."
                );
            }
            if ($branch->civil_defense_expiry) {
                $this->processAlert(
                    $branch,
                    'civil_defense_permit',
                    $branch->civil_defense_expiry,
                    'الدفاع المدني',
                    "تصريح الدفاع المدني الخاص بفرع {$branchName}",
                    "يرجى التأكد من تجديد التصريح واستيفاء متطلبات الدفاع المدني قبل تاريخ الانتهاء لتجنب الإيقاف."
                );
            }
            if ($branch->delivery_permit_expiry) {
                $this->processAlert(
                    $branch,
                    'delivery_permit',
                    $branch->delivery_permit_expiry,
                    'تصريح التوصيل',
                    "تصريح التوصيل الخاص بفرع {$branchName}",
                    "يرجى تجديد تصريح التوصيل قبل تاريخ الانتهاء لتجنب المخالفات."
                );
            }
            if ($branch->permit_24h_expiry) {
                $this->processAlert(
                    $branch,
                    'permit_24h',
                    $branch->permit_24h_expiry,
                    'تصريح 24 ساعة',
                    "تصريح 24 ساعة الخاص بفرع {$branchName}",
                    "يرجى تجديد التصريح قبل تاريخ الانتهاء لتجنب الإيقاف أو المخالفة."
                );
            }
            if ($branch->outdoor_permit_expiry) {
                $this->processAlert(
                    $branch,
                    'outdoor_seating_permit',
                    $branch->outdoor_permit_expiry,
                    'تصريح الجلسات الخارجية',
                    "تصريح الجلسات الخارجية الخاص بفرع {$branchName}",
                    "يرجى تجديد التصريح قبل تاريخ الانتهاء لتجنب المخالفات."
                );
            }
            $cleanExpiry = data_get($branch, 'clean_contract_expiry');
            if ($cleanExpiry) {
                $this->processAlert(
                    $branch,
                    'clean_contract',
                    $cleanExpiry,
                    'عقد النظافة',
                    "عقد النظافة الخاص بفرع {$branchName}",
                    "يرجى تجديد عقد النظافة أو توثيق البديل قبل تاريخ الانتهاء لتجنب المخالفات."
                );
            }
            $adPermits = data_get($branch, 'ad_permits');
            if (is_array($adPermits)) {
                foreach ($adPermits as $permit) {
                    $adExpiry = data_get($permit, 'expiry') ?: data_get($permit, 'expiry_date') ?: data_get($permit, 'end_date');
                    if (! $adExpiry) {
                        continue;
                    }
                    $adName = data_get($permit, 'name') ?: data_get($permit, 'title') ?: 'تصريح إعلاني';
                    $this->processAlert(
                        $branch,
                        'advertising_permits',
                        $adExpiry,
                        'التصاريح الإعلانية',
                        "التصريح الإعلاني ({$adName}) الخاص بفرع {$branchName}",
                        "يرجى تجديد التصريح الإعلاني قبل تاريخ الانتهاء لتجنب المخالفات."
                    );
                }
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
        $template = $this->resolveAlertTemplate($alertType);
        $thresholds = $this->parseThresholdsString((string) ($template['threshold_days'] ?? ''));
        if (empty($thresholds)) {
            $thresholds = $this->getThresholds();
        }

        // Check if daysRemaining matches any threshold
        // Or strictly if it's exactly one of the thresholds
        // To be safe, we check if it IS one of the thresholds.
        // If days < 0 (expired), we might want to alert too? User said 0 -> "Expired Today".
        
        if (!in_array($daysRemaining, $thresholds, true)) {
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
        $entityName = data_get($entity, 'name') ?: 'غير محدد';
        $branchName = data_get($entity, 'branch.name') ?: data_get($entity, 'name') ?: 'غير محدد';
        $subject = $this->fillTemplateTokens((string) ($template['subject'] ?? "تنبيه قرب انتهاء — {اسم المتطلب}"), [
            'requirement' => $requirementName,
            'context' => $contextText,
            'expiry_date' => $expiry->format('Y-m-d'),
            'days_remaining' => $daysRemaining,
            'status_text' => $statusText,
            'action_text' => $actionText,
            'branch_name' => $branchName,
            'entity_name' => $entityName,
        ]);
        $body = $this->fillTemplateTokens((string) ($template['body'] ?? ''), [
            'requirement' => $requirementName,
            'context' => $contextText,
            'expiry_date' => $expiry->format('Y-m-d'),
            'days_remaining' => $daysRemaining,
            'status_text' => $statusText,
            'action_text' => $actionText,
            'branch_name' => $branchName,
            'entity_name' => $entityName,
        ]);
        if ($body === '') {
            $body = "تنبيه رسمي:\n\n";
            $body .= "نود إشعاركم بأن {$contextText}\n";
            $body .= "سينتهي بتاريخ: " . $expiry->format('Y-m-d') . "\n\n";
            $body .= "المتبقي على الانتهاء: {$statusText}\n\n";
            $body .= "{$actionText}\n\n";
            $body .= "هذا تنبيه آلي صادر من نظام OFS.\n\n";
            $body .= "في حال تم التجديد، يرجى تحديث البيانات في النظام.";
        }

        // Determine recipients
        $recipients = [];
        if ($entity instanceof \App\Models\Employee) {
            // Check employee's specific preference for this alert type
            $preference = $entity->alertPreferences()->where('alert_type', $alertType)->first();
            if ($preference && $preference->receive_alerts) {
                $recipients[] = $entity->email;
            }
        }

        $recipientsStr = Setting::where('key', 'alert_recipients')->value('value');
        if (! $recipientsStr) {
            $recipientsStr = Setting::where('key', 'smtp_alert_recipients')->value('value');
        }
        $recipients = array_merge($recipients, $this->extractEmails($recipientsStr));
        $manualRecipients = Setting::where('key', 'alert_manual_recipients')->value('value');
        $recipients = array_merge($recipients, $this->extractEmails($manualRecipients));
        $recipients = array_merge($recipients, $this->extractEmails((string) ($template['manual_recipients'] ?? '')));
        $recipients = array_values(array_unique(array_filter(array_map(function ($email) {
            return strtolower(trim((string) $email));
        }, $recipients))));
        
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

    protected function getThresholds()
    {
        if (is_array($this->thresholds)) {
            return $this->thresholds;
        }
        $raw = Setting::where('key', 'alert_threshold_days')->value('value');
        $nums = [];
        if (is_string($raw) && trim($raw) !== '') {
            preg_match_all('/-?\d+/', $raw, $m);
            $nums = array_map('intval', $m[0] ?? []);
        }
        $nums = array_values(array_unique(array_filter($nums, function ($n) {
            return $n >= 0 && $n <= 3650;
        })));
        rsort($nums);
        if (empty($nums)) {
            $nums = [60, 30, 15, 0];
        }
        $this->thresholds = $nums;
        return $this->thresholds;
    }

    protected function parseThresholdsString($raw)
    {
        $nums = [];
        if (is_string($raw) && trim($raw) !== '') {
            preg_match_all('/-?\d+/', $raw, $m);
            $nums = array_map('intval', $m[0] ?? []);
        }
        $nums = array_values(array_unique(array_filter($nums, function ($n) {
            return $n >= 0 && $n <= 3650;
        })));
        rsort($nums);
        return $nums;
    }

    protected function extractEmails($raw)
    {
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }
        preg_match_all('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $raw, $matches);
        return $matches[0] ?? [];
    }

    protected function resolveAlertTemplate($alertType)
    {
        if (!is_array($this->alertTemplates)) {
            $this->alertTemplates = $this->loadAlertTemplates();
        }
        $aliases = [
            'health_training' => 'health_expiry',
            'municipality_card' => 'health_expiry',
            'civil_defense_permit' => 'civil_defense',
            'municipality_license' => 'municipality_license',
            'advertisement_license' => 'advertising_permits',
            'airport_permit' => 'permit_24h',
        ];
        $lookup = $aliases[$alertType] ?? $alertType;
        return $this->alertTemplates[$lookup] ?? [];
    }

    protected function loadAlertTemplates()
    {
        $defaults = $this->defaultAlertTemplates();
        $indexed = [];
        foreach ($defaults as $item) {
            if (!empty($item['key'])) {
                $indexed[$item['key']] = $item;
            }
        }
        $raw = Setting::where('key', 'alert_templates_json')->value('value');
        if (!is_string($raw) || trim($raw) === '') {
            return $indexed;
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return $indexed;
        }
        foreach ($decoded as $item) {
            if (!is_array($item) || empty($item['key'])) {
                continue;
            }
            $key = (string) $item['key'];
            $indexed[$key] = [
                'key' => $key,
                'title' => (string) ($item['title'] ?? ($indexed[$key]['title'] ?? $key)),
                'subject' => (string) ($item['subject'] ?? ($indexed[$key]['subject'] ?? '')),
                'body' => (string) ($item['body'] ?? ($indexed[$key]['body'] ?? '')),
                'threshold_days' => (string) ($item['threshold_days'] ?? ($indexed[$key]['threshold_days'] ?? '')),
                'manual_recipients' => (string) ($item['manual_recipients'] ?? ($indexed[$key]['manual_recipients'] ?? '')),
            ];
        }
        return $indexed;
    }

    protected function fillTemplateTokens($text, array $ctx)
    {
        $replacements = [
            '{اسم المتطلب}' => (string) ($ctx['requirement'] ?? ''),
            '{المتطلب}' => (string) ($ctx['requirement'] ?? ''),
            '{الجهة/الموظف}' => (string) ($ctx['entity_name'] ?? ''),
            '{اسم الموظف}' => (string) ($ctx['entity_name'] ?? ''),
            '{اسم الفرع}' => (string) ($ctx['branch_name'] ?? ''),
            '{تاريخ الانتهاء}' => (string) ($ctx['expiry_date'] ?? ''),
            '{عدد الأيام}' => (string) ($ctx['status_text'] ?? ''),
            '{حالة التنبيه}' => (string) ($ctx['status_text'] ?? ''),
            '{الإجراء}' => (string) ($ctx['action_text'] ?? ''),
            '{سياق}' => (string) ($ctx['context'] ?? ''),
        ];
        return strtr((string) $text, $replacements);
    }

    protected function defaultAlertTemplates()
    {
        return [
            [
                'key' => 'health_expiry',
                'title' => 'انتهاء الصحية Health Expiry',
                'subject' => 'تنبيه قرب انتهاء — {اسم المتطلب}',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن التدريب الصحي الخاص بـ الموظف {اسم الموظف} في فرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى إعادة أو تجديد التدريب الصحي قبل تاريخ الانتهاء حسب متطلبات الجهة المختصة.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'tcoe_expiry',
                'title' => 'انتهاء التدريب العملي T.C.O.E',
                'subject' => 'تنبيه قرب انتهاء — {اسم المتطلب}',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن التدريب العملي الخاص بـ الموظف {اسم الموظف} في فرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تحديث أو تجديد التدريب العملي قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'permit_expiry_date',
                'title' => 'تاريخ الانتهاء Expiry Date',
                'subject' => 'تنبيه قرب انتهاء — {اسم المتطلب}',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن {سياق}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى اتخاذ الإجراء اللازم قبل تاريخ الانتهاء لتجنب المخالفات أو الإيقاف.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'municipality_license',
                'title' => 'رخصة البلدية',
                'subject' => 'تنبيه قرب انتهاء — رخصة البلدية',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن رخصة البلدية الخاصة بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى البدء بإجراءات تجديد الرخصة قبل تاريخ الانتهاء لتجنب الإغلاق أو الغرامات.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'civil_defense',
                'title' => 'الدفاع المدني',
                'subject' => 'تنبيه قرب انتهاء — تصريح الدفاع المدني',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن تصريح الدفاع المدني الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى التأكد من تجديد التصريح واستيفاء متطلبات الدفاع المدني قبل تاريخ الانتهاء لتجنب الإيقاف.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'delivery_permit',
                'title' => 'تصريح التوصيل',
                'subject' => 'تنبيه قرب انتهاء — تصريح التوصيل',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن تصريح التوصيل الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد تصريح التوصيل قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'permit_24h',
                'title' => 'تصريح 24 ساعة',
                'subject' => 'تنبيه قرب انتهاء — تصريح 24 ساعة',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن تصريح 24 ساعة الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'outdoor_seating_permit',
                'title' => 'تصريح الجلسات الخارجية',
                'subject' => 'تنبيه قرب انتهاء — تصريح الجلسات الخارجية',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن تصريح الجلسات الخارجية الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'advertising_permits',
                'title' => 'التصاريح الإعلانية',
                'subject' => 'تنبيه قرب انتهاء — التصاريح الإعلانية',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن {سياق}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح الإعلاني قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
            [
                'key' => 'clean_contract',
                'title' => 'عقد النظافة',
                'subject' => 'تنبيه قرب انتهاء — عقد النظافة',
                'body' => "تنبيه رسمي:\n\nنود إشعاركم بأن عقد النظافة الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد عقد النظافة قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.",
            ],
        ];
    }
}
