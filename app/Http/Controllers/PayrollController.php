<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payroll::with('employee.user');

        // If not admin/HR, only show own payrolls
        if (!$user->canManageEmployees()) {
            $query->whereHas('employee', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        if ($request->has('month')) {
            $query->where('month', $request->month);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $payrolls = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Payroll/Index', [
            'payrolls' => $payrolls,
            'filters' => $request->only(['month', 'year', 'status']),
            'canManage' => $user->canManageEmployees(),
        ]);
    }

    public function show(Payroll $payroll)
    {
        $user = auth()->user();

        // Check access
        if (!$user->canManageEmployees()) {
            $employee = $user->employee;
            if (!$employee || $payroll->employee_id !== $employee->id) {
                abort(403);
            }
        }

        $payroll->load('employee.user');

        return Inertia::render('Payroll/Show', [
            'payroll' => $payroll,
        ]);
    }

    public function create()
    {
        $employees = Employee::with('user')
            ->where('status', 'active')
            ->get();

        return Inertia::render('Payroll/Create', [
            'employees' => $employees,
            'currentMonth' => now()->month,
            'currentYear' => now()->year,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2020',
            'overtime_pay' => 'nullable|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'other_deductions' => 'nullable|numeric|min:0',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);

        // Calculate payroll
        $basicSalary = $employee->salary_basic;
        $allowances = $employee->salary_allowances;
        $overtimePay = $validated['overtime_pay'] ?? 0;
        $bonus = $validated['bonus'] ?? 0;
        $grossSalary = $basicSalary + $allowances + $overtimePay + $bonus;

        // Calculate deductions (simplified)
        $tax = $grossSalary * 0.05; // 5% tax
        $socialSecurity = $grossSalary * 0.02; // 2% social security
        $healthInsurance = 100000; // Fixed health insurance
        $otherDeductions = $validated['other_deductions'] ?? 0;
        $totalDeductions = $tax + $socialSecurity + $healthInsurance + $otherDeductions;

        $netSalary = $grossSalary - $totalDeductions;

        Payroll::create([
            'employee_id' => $validated['employee_id'],
            'month' => $validated['month'],
            'year' => $validated['year'],
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'overtime_pay' => $overtimePay,
            'bonus' => $bonus,
            'gross_salary' => $grossSalary,
            'tax' => $tax,
            'social_security' => $socialSecurity,
            'health_insurance' => $healthInsurance,
            'other_deductions' => $otherDeductions,
            'total_deductions' => $totalDeductions,
            'net_salary' => $netSalary,
            'status' => 'draft',
        ]);

        return redirect()->route('payroll.index')
            ->with('success', 'Payroll created successfully.');
    }

    public function process(Payroll $payroll)
    {
        $payroll->update(['status' => 'processed']);

        return back()->with('success', 'Payroll processed.');
    }

    public function pay(Payroll $payroll)
    {
        $payroll->update([
            'status' => 'paid',
            'payment_date' => now(),
        ]);

        return back()->with('success', 'Payroll marked as paid.');
    }
}
