<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['user', 'manager.user'])
            ->where('status', 'active')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->user->name,
                    'job_title' => $employee->job_title,
                    'department' => $employee->department,
                    'manager_id' => $employee->manager_id,
                    'avatar' => $employee->user->name[0],
                ];
            });

        // Get department list
        $departments = Employee::where('status', 'active')
            ->distinct()
            ->pluck('department')
            ->filter()
            ->values()
            ->toArray();

        return Inertia::render('Organization/Index', [
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }
}
