<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Setting;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDueNotification;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('tasks:check-due', function () {
    $today = now()->format('Y-m-d');

    // Find tasks due today or earlier, not completed, and not yet notified
    $tasks = Task::whereDate('due_date', '<=', $today)
        ->whereNotIn('status', ['done', 'completed'])
        ->with('assignee')
        ->get();

    $count = 0;
    foreach ($tasks as $task) {
        if (! $task->assignee) {
            continue;
        }

        $already = DB::table('notifications')
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $task->assigned_to)
            ->where('type', TaskDueNotification::class)
            ->where('data', 'like', '%"task_id":'.$task->id.'%')
            ->exists();

        if ($already) {
            continue;
        }

        $task->assignee->notify(new TaskDueNotification($task));
        $count++;
        $this->info("Notified {$task->assignee->name} about task: {$task->title}");
    }

    $this->info("Checked due tasks. Notified: $count");

})->purpose('Check for due tasks and notify assignees');

// Register Schedule
Schedule::command('tasks:check-due')->hourly();
// Register the new class-based command for comprehensive alerts
Schedule::command('alerts:check-expiries')->dailyAt('09:00');
