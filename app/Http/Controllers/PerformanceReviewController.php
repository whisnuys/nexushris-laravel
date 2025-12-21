<?php

namespace App\Http\Controllers;

use App\Models\PerformanceReview;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerformanceReviewController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->isAdmin() || $user->isHRManager()) {
            $reviews = PerformanceReview::with(['employee.user', 'reviewer'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        } else {
            $employee = $user->employee;
            $reviews = $employee
                ? PerformanceReview::with(['employee.user', 'reviewer'])
                ->where('employee_id', $employee->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                : collect([]);
        }

        return Inertia::render('PerformanceReviews/Index', [
            'reviews' => $reviews,
            'canCreate' => $user->isAdmin() || $user->isHRManager(),
        ]);
    }

    public function create()
    {
        $employees = Employee::with('user')->where('status', 'active')->get();

        return Inertia::render('PerformanceReviews/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'review_period' => 'required|string|max:100',
            'rating' => 'nullable|integer|min:1|max:5',
            'strengths' => 'nullable|string',
            'improvements' => 'nullable|string',
            'goals' => 'nullable|string',
            'comments' => 'nullable|string',
            'status' => 'required|in:draft,submitted',
        ]);

        $validated['reviewer_id'] = auth()->id();
        if ($validated['status'] === 'submitted') {
            $validated['submitted_at'] = now();
        }

        PerformanceReview::create($validated);

        return redirect()->route('performance-reviews.index')->with('success', 'Review created!');
    }

    public function show(PerformanceReview $performanceReview)
    {
        $performanceReview->load(['employee.user', 'reviewer']);

        return Inertia::render('PerformanceReviews/Show', [
            'review' => $performanceReview,
        ]);
    }
}
