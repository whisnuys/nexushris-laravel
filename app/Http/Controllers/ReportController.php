<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Attendance stats for current month
        $attendanceStats = $this->getAttendanceStats($currentMonth, $currentYear);

        // Leave stats
        $leaveStats = $this->getLeaveStats($currentMonth, $currentYear);

        // Payroll summary
        $payrollStats = $this->getPayrollStats($currentMonth, $currentYear);

        // Department distribution
        $departmentDistribution = Employee::where('status', 'active')
            ->selectRaw('department, count(*) as count')
            ->groupBy('department')
            ->get();

        // Monthly attendance trend (last 6 months)
        $attendanceTrend = $this->getAttendanceTrend();

        // Monthly payroll trend (last 6 months)
        $payrollTrend = $this->getPayrollTrend();

        return Inertia::render('Reports/Index', [
            'attendanceStats' => $attendanceStats,
            'leaveStats' => $leaveStats,
            'payrollStats' => $payrollStats,
            'departmentDistribution' => $departmentDistribution,
            'attendanceTrend' => $attendanceTrend,
            'payrollTrend' => $payrollTrend,
        ]);
    }

    private function getAttendanceStats($month, $year)
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        $totalDays = now()->day;
        $totalEmployees = Employee::where('status', 'active')->count();

        $presentCount = Attendance::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'present')
            ->count();

        $lateCount = Attendance::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'late')
            ->count();

        $absentCount = Attendance::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'absent')
            ->count();

        return [
            'present' => $presentCount,
            'late' => $lateCount,
            'absent' => $absentCount,
            'attendanceRate' => $totalEmployees > 0 && $totalDays > 0
                ? round(($presentCount + $lateCount) / ($totalEmployees * $totalDays) * 100, 1)
                : 0,
        ];
    }

    private function getLeaveStats($month, $year)
    {
        return [
            'pending' => LeaveRequest::where('status', 'pending')->count(),
            'approved' => LeaveRequest::where('status', 'approved')
                ->whereMonth('start_date', $month)
                ->whereYear('start_date', $year)
                ->count(),
            'rejected' => LeaveRequest::where('status', 'rejected')
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->count(),
        ];
    }

    private function getPayrollStats($month, $year)
    {
        $payrolls = Payroll::where('month', $month)
            ->where('year', $year)
            ->get();

        return [
            'totalGross' => $payrolls->sum('gross_salary'),
            'totalDeductions' => $payrolls->sum('total_deductions'),
            'totalNet' => $payrolls->sum('net_salary'),
            'processed' => $payrolls->where('status', 'processed')->count(),
            'paid' => $payrolls->where('status', 'paid')->count(),
            'draft' => $payrolls->where('status', 'draft')->count(),
        ];
    }

    private function getAttendanceTrend()
    {
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $presentCount = Attendance::whereMonth('date', $month)
                ->whereYear('date', $year)
                ->whereIn('status', ['present', 'late'])
                ->count();

            $trend[] = [
                'month' => $date->format('M Y'),
                'present' => $presentCount,
            ];
        }
        return $trend;
    }

    private function getPayrollTrend()
    {
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $total = Payroll::where('month', $month)
                ->where('year', $year)
                ->sum('net_salary');

            $trend[] = [
                'month' => $date->format('M Y'),
                'amount' => $total,
            ];
        }
        return $trend;
    }
}
