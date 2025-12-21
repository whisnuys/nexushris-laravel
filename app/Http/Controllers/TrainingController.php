<?php

namespace App\Http\Controllers;

use App\Models\Training;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function index()
    {
        $trainings = Training::withCount('employees')
            ->orderBy('start_date', 'desc')
            ->paginate(10);

        return Inertia::render('Trainings/Index', [
            'trainings' => $trainings,
            'canManage' => auth()->user()->isAdmin() || auth()->user()->isHRManager(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Trainings/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'provider' => 'nullable|string|max:255',
            'type' => 'required|in:online,in-person,hybrid',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'duration_hours' => 'nullable|integer|min:1',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
        ]);

        Training::create($validated);

        return redirect()->route('trainings.index')->with('success', 'Training created!');
    }

    public function show(Training $training)
    {
        $training->load('employees.user');
        $allEmployees = Employee::with('user')->where('status', 'active')->get();

        return Inertia::render('Trainings/Show', [
            'training' => $training,
            'allEmployees' => $allEmployees,
            'canManage' => auth()->user()->isAdmin() || auth()->user()->isHRManager(),
        ]);
    }

    public function enroll(Request $request, Training $training)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);

        $training->employees()->attach($validated['employee_id'], ['status' => 'enrolled']);

        return redirect()->back()->with('success', 'Employee enrolled!');
    }

    public function updateProgress(Request $request, Training $training, Employee $employee)
    {
        $validated = $request->validate([
            'status' => 'required|in:enrolled,in_progress,completed,failed',
            'score' => 'nullable|integer|min:0|max:100',
        ]);

        $updateData = ['status' => $validated['status']];
        if ($validated['status'] === 'completed') {
            $updateData['completed_at'] = now();
            $updateData['score'] = $validated['score'] ?? null;
        }

        $training->employees()->updateExistingPivot($employee->id, $updateData);

        return redirect()->back()->with('success', 'Progress updated!');
    }
}
