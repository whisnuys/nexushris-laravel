<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Attendance::with('employee.user');

        // If not admin/HR, only show own attendance
        if (!$user->canManageEmployees()) {
            $query->whereHas('employee', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        } else {
            $query->whereDate('date', today());
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest()->paginate(20)->withQueryString();

        // Get today's attendance for current user
        $employee = $user->employee;
        $todayAttendance = null;

        if ($employee) {
            $todayAttendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('date', today())
                ->first();
        }

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
            'todayAttendance' => $todayAttendance,
            'filters' => $request->only(['date', 'status']),
            'canManage' => $user->canManageEmployees(),
        ]);
    }

    public function clockIn(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->with('error', 'No employee profile found.');
        }

        // Check if already clocked in today
        $existing = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        if ($existing && $existing->check_in) {
            return back()->with('error', 'Already clocked in today.');
        }

        $now = now();
        $status = $now->hour >= 9 ? 'late' : 'present';

        if ($existing) {
            $existing->update([
                'check_in' => $now->format('H:i:s'),
                'check_in_latitude' => $request->latitude,
                'check_in_longitude' => $request->longitude,
                'status' => $status,
            ]);
        } else {
            Attendance::create([
                'employee_id' => $employee->id,
                'date' => today(),
                'check_in' => $now->format('H:i:s'),
                'check_in_latitude' => $request->latitude,
                'check_in_longitude' => $request->longitude,
                'status' => $status,
            ]);
        }

        return back()->with('success', 'Clocked in successfully at ' . $now->format('H:i'));
    }

    public function clockOut(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->with('error', 'No employee profile found.');
        }

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        if (!$attendance || !$attendance->check_in) {
            return back()->with('error', 'Please clock in first.');
        }

        if ($attendance->check_out) {
            return back()->with('error', 'Already clocked out today.');
        }

        $now = now();

        $attendance->update([
            'check_out' => $now->format('H:i:s'),
            'check_out_latitude' => $request->latitude,
            'check_out_longitude' => $request->longitude,
        ]);

        return back()->with('success', 'Clocked out successfully at ' . $now->format('H:i'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:present,late,absent,on_leave',
            'notes' => 'nullable|string',
        ]);

        Attendance::updateOrCreate(
            [
                'employee_id' => $validated['employee_id'],
                'date' => $validated['date'],
            ],
            $validated
        );

        return back()->with('success', 'Attendance recorded.');
    }
}
