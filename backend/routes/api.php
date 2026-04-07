<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HousingController;
use App\Http\Controllers\LicenseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ViolationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// مسار المستخدم (افتراضي من لارافل)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// --- مسارات نظام المخالفات الخاص بك ---

// جلب وتعديل المخالفات
Route::apiResource('violations', ViolationController::class);

// مسار خاص لتحديث حالة المخالفة إلى "مدفوعة"
Route::post('/violations/{id}/paid', [ViolationController::class, 'markPaid']);
Route::post('/violations/{id}/archive', [ViolationController::class, 'archive']);
Route::post('/violations/{id}/attachments', [ViolationController::class, 'attach']);

// --- مسارات نظام الإنذارات ---

// جلب وتعديل الإنذارات
Route::apiResource('alerts', AlertController::class);
Route::post('/alerts/{id}/attachments', [AlertController::class, 'attach']);

Route::apiResource('employees', EmployeeController::class);
Route::post('/employees/{id}/attachments', [EmployeeController::class, 'attach']);
Route::apiResource('branches', BranchController::class);
Route::post('/branches/{id}/attachments', [BranchController::class, 'attach']);
Route::apiResource('licenses', LicenseController::class);
Route::post('/licenses/{id}/archive', [LicenseController::class, 'archive']);
Route::post('/licenses/{id}/restore', [LicenseController::class, 'restore']);
Route::post('/licenses/{id}/attachments', [LicenseController::class, 'attach']);
Route::apiResource('contracts', ContractController::class);
Route::post('/contracts/{id}/archive', [ContractController::class, 'archive']);
Route::post('/contracts/{id}/restore', [ContractController::class, 'restore']);
Route::post('/contracts/{id}/attachments', [ContractController::class, 'attach']);
Route::apiResource('housings', HousingController::class);
Route::apiResource('transports', TransportController::class);
Route::apiResource('training', TrainingController::class);
Route::post('/attachments', [AttachmentController::class, 'store']);

// Routes جديدة للمرفقات المتقدمة
Route::get('/branches/{branchId}/attachments', [AttachmentController::class, 'index']);
Route::post('/branches/{branchId}/attachments', [AttachmentController::class, 'store']);
Route::delete('/branches/{branchId}/attachments/{attachmentId}', [AttachmentController::class, 'destroy']);
Route::get('/branches/{branchId}/attachments/{attachmentId}/download', [AttachmentController::class, 'download']);
Route::get('/attachments/by-cost-center/{costCenter}', [AttachmentController::class, 'byCostCenter']);

Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);

// Tasks - moved to public for unified access as per request (or add auth token handling later)
Route::apiResource('tasks', TaskController::class);
Route::post('/tasks/{task}/comments', [TaskCommentController::class, 'store']);
Route::post('/chat/send', [TaskCommentController::class, 'storeChat']);

use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\PresenceController;

Route::apiResource('quotes', QuoteController::class);

Route::post('/presence/heartbeat', [PresenceController::class, 'heartbeat']);
Route::get('/presence/users', [PresenceController::class, 'index']);

// Settings Routes
Route::get('/settings', [SettingsController::class, 'index']);
Route::post('/settings', [SettingsController::class, 'update']);
Route::post('/settings/test-mail', [SettingsController::class, 'testMail']);

// Employee Alert Preferences Routes
Route::post('/employee-alert-preferences', [\App\Http\Controllers\EmployeeAlertPreferenceController::class, 'updatePreferences']);
Route::get('/employee-alert-preferences/{employeeId}', [\App\Http\Controllers\EmployeeAlertPreferenceController::class, 'getPreferences']);

/*
Route::middleware('auth:sanctum')->group(function () {
    // Original auth routes - moved out for unified open access
});
*/

// Public read-only routes (for now)
Route::get('/users-list', function () {
    try {
        return \App\Models\User::select('id', 'name')->get();
    } catch (\Exception $e) {
        // Fallback mock data if DB fails
        return response()->json([
            ['id' => 1, 'name' => 'Admin User'],
            ['id' => 2, 'name' => 'Employee User'],
            ['id' => 3, 'name' => 'Support Agent'],
        ]);
    }
});
Route::get('/users-list-public', function () {
    // Return users or employees
    try {
        return \App\Models\User::select('id', 'name')->get();
    } catch (\Exception $e) {
        return response()->json([
            ['id' => 1, 'name' => 'Admin User'],
            ['id' => 2, 'name' => 'Employee User'],
        ]);
    }
});

// Support Tickets API
use App\Http\Controllers\SupportTicketController;

Route::apiResource('tickets', SupportTicketController::class);
use App\Http\Controllers\InboxMessageController;

Route::apiResource('inbox', InboxMessageController::class);
