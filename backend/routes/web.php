<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/index.html');
});

Route::get('/dashboard', function () {
    return redirect('/index.html');
});

Route::get('/tasks', function () {
    return view('tasks');
});

Route::get('/help', function () {
    return view('help');
});

// Serve current admin.html from public (single source of truth)
Route::get('/admin.html', function () {
    $path = public_path('admin.html');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
    abort(404);
});

// Redirect routes to static files
Route::get('/employees', function () {
    return redirect('/employees.html');
});
Route::get('/branches', function () {
    return redirect('/branches.html');
});
Route::get('/licenses', function () {
    return redirect('/licenses.html');
});
Route::get('/violations', function () {
    return redirect('/violations.html');
});
Route::get('/housings', function () {
    return redirect('/housings.html');
});
Route::get('/transports', function () {
    return redirect('/transports.html');
});
Route::get('/training', function () {
    return redirect('/training.html');
});

Route::get('/admin', function () {
    return redirect('/admin.html');
});

Route::get('/admin/organized', function () {
    return file_get_contents(public_path('admin-organized.html'));
});

// Frontend routes
Route::get('/home', function () {
    return redirect('/index.html');
});
Route::get('/login', function () {
    return redirect('/login.html');
});
Route::get('/profile', function () {
    return view('placeholder', ['title' => 'الملف الشخصي']);
});
Route::get('/my-files', function () {
    return view('placeholder', ['title' => 'ملفاتي']);
});
Route::get('/my-tasks', function () {
    return view('tasks');
});

// Admin quick access routes
Route::get('/admin/activity', function () {
    return redirect('/activity_log.html');
});
Route::get('/admin/members', function () {
    return redirect('/members.html');
});
Route::get('/admin/reports', function () {
    return redirect('/reports.html');
});
Route::get('/admin/board', function () {
    return redirect('/board.html');
});
Route::get('/public', function () {
    return redirect('/index.html');
});
Route::get('/public/management-report', function () {
    return redirect('/board.html');
});
Route::get('/admin/settings/general', function () {
    return view('placeholder', ['title' => 'الإعدادات العامة']);
});
Route::get('/admin/settings/advanced', function () {
    return view('placeholder', ['title' => 'الإعدادات المتقدمة']);
});
Route::get('/admin/roles', function () {
    return view('placeholder', ['title' => 'الأدوار والصلاحيات']);
});
Route::get('/admin/messages', function () {
    return view('placeholder', ['title' => 'الرسائل والأرشفة']);
});
Route::get('/admin/complaints', function () {
    return view('placeholder', ['title' => 'الشكاوى والطلبات']);
});
