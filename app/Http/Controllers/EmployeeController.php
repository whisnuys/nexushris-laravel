<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('employee_code', 'like', "%{$search}%")
                ->orWhere('department', 'like', "%{$search}%");
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('department') && $request->department !== 'all') {
            $query->where('department', $request->department);
        }

        $employees = $query->latest()->paginate(10)->withQueryString();

        $departments = Employee::distinct()->pluck('department');

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'status', 'department']),
        ]);
    }

    public function create()
    {
        $managers = User::whereIn('role', ['admin', 'hr_manager'])->get();
        $departments = Employee::distinct()->pluck('department');

        return Inertia::render('Employees/Create', [
            'managers' => $managers,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'employee_code' => 'required|string|unique:employees,employee_code',
            'job_title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'manager_id' => 'nullable|exists:users,id',
            'salary_basic' => 'required|numeric|min:0',
            'salary_allowances' => 'required|numeric|min:0',
            'join_date' => 'required|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => 'employee',
        ]);

        Employee::create([
            'user_id' => $user->id,
            'employee_code' => $validated['employee_code'],
            'job_title' => $validated['job_title'],
            'department' => $validated['department'],
            'manager_id' => $validated['manager_id'],
            'salary_basic' => $validated['salary_basic'],
            'salary_allowances' => $validated['salary_allowances'],
            'join_date' => $validated['join_date'],
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        $employee->load(['user', 'manager']);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        $employee->load('user');
        $managers = User::whereIn('role', ['admin', 'hr_manager'])->get();
        $departments = Employee::distinct()->pluck('department');

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'managers' => $managers,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($employee->user_id)],
            'phone' => 'nullable|string|max:20',
            'job_title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'manager_id' => 'nullable|exists:users,id',
            'salary_basic' => 'required|numeric|min:0',
            'salary_allowances' => 'required|numeric|min:0',
            'status' => 'required|in:active,on_leave,resigned,terminated',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
        ]);

        $employee->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        $employee->update([
            'job_title' => $validated['job_title'],
            'department' => $validated['department'],
            'manager_id' => $validated['manager_id'],
            'salary_basic' => $validated['salary_basic'],
            'salary_allowances' => $validated['salary_allowances'],
            'status' => $validated['status'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->user->delete();
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
