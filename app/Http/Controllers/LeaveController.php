<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = LeaveRequest::with(['employee.user', 'approver']);

        // If not admin/HR, only show own leaves
        if (!$user->canManageEmployees()) {
            $query->whereHas('employee', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('leave_type', $request->type);
        }

        $leaves = $query->latest()->paginate(10)->withQueryString();

        // Get leave balance for current user
        $employee = $user->employee;
        $leaveBalance = null;

        if ($employee) {
            $leaveBalance = [
                'annual' => $employee->annual_leave_balance,
                'sick' => $employee->sick_leave_balance,
            ];
        }

        return Inertia::render('Leave/Index', [
            'leaves' => $leaves,
            'leaveBalance' => $leaveBalance,
            'filters' => $request->only(['status', 'type']),
            'canManage' => $user->canManageEmployees(),
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $employee = $user->employee;

        if (!$employee) {
            return redirect()->route('dashboard')
                ->with('error', 'No employee profile found.');
        }

        return Inertia::render('Leave/Create', [
            'leaveBalance' => [
                'annual' => $employee->annual_leave_balance,
                'sick' => $employee->sick_leave_balance,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => 'required|in:annual,sick,unpaid,maternity,paternity',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->with('error', 'No employee profile found.');
        }

        // Calculate total days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;

        // Check balance for annual/sick leave
        if ($validated['leave_type'] === 'annual' && $totalDays > $employee->annual_leave_balance) {
            return back()->with('error', 'Insufficient annual leave balance.');
        }

        if ($validated['leave_type'] === 'sick' && $totalDays > $employee->sick_leave_balance) {
            return back()->with('error', 'Insufficient sick leave balance.');
        }

        LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_days' => $totalDays,
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return redirect()->route('leave.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    public function approve(Request $request, LeaveRequest $leave)
    {
        $user = $request->user();

        if (!$user->canManageEmployees()) {
            abort(403);
        }

        $leave->update([
            'status' => 'approved',
            'approver_id' => $user->id,
            'approved_at' => now(),
        ]);

        // Deduct from balance
        $employee = $leave->employee;
        if ($leave->leave_type === 'annual') {
            $employee->decrement('annual_leave_balance', $leave->total_days);
        } elseif ($leave->leave_type === 'sick') {
            $employee->decrement('sick_leave_balance', $leave->total_days);
        }

        return back()->with('success', 'Leave request approved.');
    }

    public function reject(Request $request, LeaveRequest $leave)
    {
        $user = $request->user();

        if (!$user->canManageEmployees()) {
            abort(403);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $leave->update([
            'status' => 'rejected',
            'approver_id' => $user->id,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return back()->with('success', 'Leave request rejected.');
    }
}
