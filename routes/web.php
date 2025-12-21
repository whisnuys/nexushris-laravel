<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\PerformanceReviewController;
use App\Http\Controllers\TrainingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Attendance (all authenticated users)
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clockIn');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('attendance.clockOut');

    // Leave (all authenticated users can view and request)
    Route::get('/leave', [LeaveController::class, 'index'])->name('leave.index');
    Route::get('/leave/create', [LeaveController::class, 'create'])->name('leave.create');
    Route::post('/leave', [LeaveController::class, 'store'])->name('leave.store');

    // Payroll (view own payslips)
    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::get('/payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');
});

// Admin/HR Manager routes
Route::middleware(['auth', 'verified', 'role:admin,hr_manager'])->group(function () {
    // Employee Management
    Route::resource('employees', EmployeeController::class);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Organization
    Route::get('/organization', [OrganizationController::class, 'index'])->name('organization.index');

    // Audit Trail
    Route::get('/audit', [AuditController::class, 'index'])->name('audit.index');

    // Attendance Management
    Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');

    // Leave Approval
    Route::post('/leave/{leave}/approve', [LeaveController::class, 'approve'])->name('leave.approve');
    Route::post('/leave/{leave}/reject', [LeaveController::class, 'reject'])->name('leave.reject');

    // Payroll Management
    Route::get('/payroll/create', [PayrollController::class, 'create'])->name('payroll.create');
    Route::post('/payroll', [PayrollController::class, 'store'])->name('payroll.store');
    Route::post('/payroll/{payroll}/process', [PayrollController::class, 'process'])->name('payroll.process');
    Route::post('/payroll/{payroll}/pay', [PayrollController::class, 'pay'])->name('payroll.pay');

    // Announcements
    Route::resource('announcements', AnnouncementController::class)->except(['show']);

    // Performance Reviews
    Route::resource('performance-reviews', PerformanceReviewController::class)->only(['index', 'create', 'store', 'show']);

    // Trainings
    Route::resource('trainings', TrainingController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('/trainings/{training}/enroll', [TrainingController::class, 'enroll'])->name('trainings.enroll');
    Route::patch('/trainings/{training}/employees/{employee}', [TrainingController::class, 'updateProgress'])->name('trainings.updateProgress');
});

require __DIR__ . '/auth.php';
