<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->canManageEmployees()) {
            return $this->adminDashboard($user);
        }

        return $this->employeeDashboard($user);
    }

    private function adminDashboard(User $user)
    {
        $stats = [
            'totalEmployees' => Employee::where('status', 'active')->count(),
            'presentToday' => Attendance::whereDate('date', today())
                ->where('status', 'present')
                ->count(),
            'pendingLeaves' => LeaveRequest::where('status', 'pending')->count(),
            'processedPayrolls' => Payroll::where('status', 'processed')
                ->where('month', now()->month)
                ->where('year', now()->year)
                ->count(),
        ];

        $recentLeaveRequests = LeaveRequest::with(['employee.user'])
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        $recentAttendance = Attendance::with(['employee.user'])
            ->whereDate('date', today())
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentLeaveRequests' => $recentLeaveRequests,
            'recentAttendance' => $recentAttendance,
        ]);
    }

    private function employeeDashboard(User $user)
    {
        $employee = $user->employee;

        if (!$employee) {
            return Inertia::render('Dashboard/NoEmployee');
        }

        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        $leaveBalance = [
            'annual' => $employee->annual_leave_balance,
            'sick' => $employee->sick_leave_balance,
        ];

        $recentLeaves = LeaveRequest::where('employee_id', $employee->id)
            ->latest()
            ->take(5)
            ->get();

        $latestPayroll = Payroll::where('employee_id', $employee->id)
            ->where('status', 'paid')
            ->latest()
            ->first();

        return Inertia::render('Dashboard/Employee', [
            'employee' => $employee,
            'todayAttendance' => $todayAttendance,
            'leaveBalance' => $leaveBalance,
            'recentLeaves' => $recentLeaves,
            'latestPayroll' => $latestPayroll,
        ]);
    }
}
