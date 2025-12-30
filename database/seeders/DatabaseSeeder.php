<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\Announcement;
use App\Models\PerformanceReview;
use App\Models\Training;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===================== USERS =====================
        $admin = User::create([
            'name' => 'Whisnu Yudha',
            'email' => 'admin@nexushris.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '+62 812 3456 7890',
        ]);

        $hrManager = User::create([
            'name' => 'Sarah Anderson',
            'email' => 'hr@nexushris.com',
            'password' => bcrypt('password'),
            'role' => 'hr_manager',
            'phone' => '+62 812 3456 7891',
        ]);

        // Create 12 employees (salaries in USD)
        $employeeData = [
            ['name' => 'Michael Chen', 'email' => 'michael.chen@nexushris.com', 'job_title' => 'Senior Software Engineer', 'department' => 'Engineering', 'salary' => 8500],
            ['name' => 'Emily Rodriguez', 'email' => 'emily.rodriguez@nexushris.com', 'job_title' => 'Product Manager', 'department' => 'Product', 'salary' => 9500],
            ['name' => 'David Kim', 'email' => 'david.kim@nexushris.com', 'job_title' => 'UI/UX Designer', 'department' => 'Design', 'salary' => 7200],
            ['name' => 'Jessica Williams', 'email' => 'jessica.williams@nexushris.com', 'job_title' => 'Marketing Manager', 'department' => 'Marketing', 'salary' => 8000],
            ['name' => 'James Thompson', 'email' => 'james.thompson@nexushris.com', 'job_title' => 'DevOps Engineer', 'department' => 'Engineering', 'salary' => 7800],
            ['name' => 'Amanda Lee', 'email' => 'amanda.lee@nexushris.com', 'job_title' => 'HR Specialist', 'department' => 'Human Resources', 'salary' => 5500],
            ['name' => 'Robert Garcia', 'email' => 'robert.garcia@nexushris.com', 'job_title' => 'Financial Analyst', 'department' => 'Finance', 'salary' => 6800],
            ['name' => 'Michelle Tan', 'email' => 'michelle.tan@nexushris.com', 'job_title' => 'Junior Developer', 'department' => 'Engineering', 'salary' => 4500],
            ['name' => 'Chris Johnson', 'email' => 'chris.johnson@nexushris.com', 'job_title' => 'Sales Manager', 'department' => 'Sales', 'salary' => 8500],
            ['name' => 'Lisa Wang', 'email' => 'lisa.wang@nexushris.com', 'job_title' => 'QA Engineer', 'department' => 'Engineering', 'salary' => 6200],
            ['name' => 'Daniel Pratama', 'email' => 'daniel.pratama@nexushris.com', 'job_title' => 'Backend Developer', 'department' => 'Engineering', 'salary' => 7200],
            ['name' => 'Sophia Martinez', 'email' => 'sophia.martinez@nexushris.com', 'job_title' => 'Content Writer', 'department' => 'Marketing', 'salary' => 4200],
        ];

        $employees = [];
        $code = 1;
        foreach ($employeeData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt('password'),
                'role' => 'employee',
                'phone' => '+62 8' . rand(10, 99) . ' ' . rand(1000, 9999) . ' ' . rand(1000, 9999),
            ]);

            $employees[] = Employee::create([
                'user_id' => $user->id,
                'employee_code' => 'EMP' . str_pad($code++, 3, '0', STR_PAD_LEFT),
                'job_title' => $data['job_title'],
                'department' => $data['department'],
                'manager_id' => $hrManager->id,
                'salary_basic' => $data['salary'],
                'salary_allowances' => $data['salary'] * 0.2,
                'join_date' => Carbon::now()->subMonths(rand(6, 36))->format('Y-m-d'),
                'status' => 'active',
                'annual_leave_balance' => rand(8, 14),
                'sick_leave_balance' => rand(6, 12),
                'address' => 'Jl. ' . ['Sudirman', 'Gatot Subroto', 'Kuningan', 'Thamrin', 'Rasuna Said'][rand(0, 4)] . ' No. ' . rand(1, 200),
                'city' => ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'][rand(0, 3)],
                'postal_code' => rand(10000, 99999),
            ]);
        }

        // ===================== ATTENDANCE (Last 6 months including today) =====================
        // Generate attendance for last 6 months (for trend charts)
        for ($monthsAgo = 5; $monthsAgo >= 0; $monthsAgo--) {
            $monthStart = Carbon::now()->subMonths($monthsAgo)->startOfMonth();
            $monthEnd = $monthsAgo === 0 ? Carbon::now() : Carbon::now()->subMonths($monthsAgo)->endOfMonth();

            for ($date = $monthStart->copy(); $date <= $monthEnd; $date->addDay()) {
                if ($date->isWeekend()) continue;

                foreach ($employees as $emp) {
                    $status = rand(1, 10) > 1 ? (rand(1, 10) > 2 ? 'present' : 'late') : 'absent';
                    $checkIn = $status !== 'absent' ? $date->copy()->setTime(8, rand(0, 59), 0) : null;
                    if ($status === 'late') $checkIn = $date->copy()->setTime(9, rand(0, 30), 0);
                    $checkOut = $checkIn ? $date->copy()->setTime(17, rand(0, 59), 0) : null;

                    Attendance::create([
                        'employee_id' => $emp->id,
                        'date' => $date->format('Y-m-d'),
                        'check_in' => $checkIn,
                        'check_out' => $checkOut,
                        'status' => $status,
                        'notes' => $status === 'absent' ? ['Sick', 'Personal emergency', 'Family matter'][rand(0, 2)] : null,
                    ]);
                }
            }
        }

        // ===================== LEAVE REQUESTS =====================
        $leaveTypes = ['annual', 'sick', 'unpaid', 'maternity'];
        $leaveStatuses = ['pending', 'approved', 'rejected'];
        foreach (array_slice($employees, 0, 8) as $idx => $emp) {
            $startDate = Carbon::now()->addDays(rand(5, 30));
            $endDate = Carbon::now()->addDays(rand(31, 40));
            $totalDays = $startDate->diffInDays($endDate) + 1;

            LeaveRequest::create([
                'employee_id' => $emp->id,
                'leave_type' => $leaveTypes[rand(0, 3)],
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'reason' => ['Family vacation', 'Medical appointment', 'Personal matters', 'Wedding ceremony', 'Religious holiday'][rand(0, 4)],
                'status' => $leaveStatuses[$idx % 3],
                'approver_id' => $idx % 3 !== 0 ? $hrManager->id : null,
            ]);
        }

        // ===================== PAYROLL (Last 6 months for trend charts) =====================
        for ($monthsAgo = 5; $monthsAgo >= 0; $monthsAgo--) {
            $payDate = Carbon::now()->subMonths($monthsAgo);
            foreach ($employees as $idx => $emp) {
                $basic = $emp->salary_basic;
                $allowances = $emp->salary_allowances;
                $overtime = rand(0, 2000000);
                $bonus = rand(0, 1000000);
                $gross = $basic + $allowances + $overtime + $bonus;
                $tax = $gross * 0.05;
                $socialSecurity = $basic * 0.02;
                $healthInsurance = 200000;
                $otherDeductions = rand(0, 500000);
                $totalDeductions = $tax + $socialSecurity + $healthInsurance + $otherDeductions;

                Payroll::create([
                    'employee_id' => $emp->id,
                    'month' => $payDate->month,
                    'year' => $payDate->year,
                    'basic_salary' => $basic,
                    'allowances' => $allowances,
                    'overtime_pay' => $overtime,
                    'bonus' => $bonus,
                    'gross_salary' => $gross,
                    'tax' => $tax,
                    'social_security' => $socialSecurity,
                    'health_insurance' => $healthInsurance,
                    'other_deductions' => $otherDeductions,
                    'total_deductions' => $totalDeductions,
                    'net_salary' => $gross - $totalDeductions,
                    'status' => $monthsAgo > 0 ? 'paid' : ['draft', 'processed', 'paid'][$idx % 3],
                    'payment_date' => $monthsAgo > 0 ? $payDate->endOfMonth()->format('Y-m-d') : null,
                ]);
            }
        }

        // ===================== ANNOUNCEMENTS =====================
        $announcements = [
            ['title' => 'Year-End Company Party 2024', 'content' => 'We are excited to announce our annual year-end celebration! Join us for an evening of entertainment, awards, and networking. Date: December 28th, 2024 at Grand Ballroom.', 'priority' => 'high'],
            ['title' => 'New Health Insurance Policy', 'content' => 'Starting January 2025, we will be upgrading our health insurance coverage. All employees will receive enhanced medical benefits including dental and vision coverage.', 'priority' => 'normal'],
            ['title' => 'Office Closure - National Holiday', 'content' => 'Please note that the office will be closed on December 25th for Christmas Day. Regular operations will resume on December 26th.', 'priority' => 'normal'],
            ['title' => 'Q4 Performance Review Deadline', 'content' => 'All Q4 performance reviews must be submitted by December 31st. Managers, please ensure all team member evaluations are completed on time.', 'priority' => 'urgent'],
            ['title' => 'New Remote Work Policy Update', 'content' => 'We are pleased to announce an updated remote work policy. Employees may now work from home up to 3 days per week, effective January 1st, 2025.', 'priority' => 'high'],
        ];

        foreach ($announcements as $idx => $ann) {
            Announcement::create([
                'user_id' => $admin->id,
                'title' => $ann['title'],
                'content' => $ann['content'],
                'priority' => $ann['priority'],
                'status' => 'published',
                'published_at' => Carbon::now()->subDays($idx * 2),
                'expires_at' => Carbon::now()->addMonths(1),
            ]);
        }

        // ===================== PERFORMANCE REVIEWS =====================
        foreach (array_slice($employees, 0, 6) as $idx => $emp) {
            PerformanceReview::create([
                'employee_id' => $emp->id,
                'reviewer_id' => $hrManager->id,
                'review_period' => 'Q4 2024',
                'rating' => rand(3, 5), // 1-5 integer
                'strengths' => 'Strong technical skills, excellent team collaboration, consistently meets deadlines.',
                'improvements' => 'Could improve on documentation practices and cross-team communication.',
                'goals' => 'Complete advanced certification, mentor junior team members, lead one major project.',
                'comments' => 'Great performance this quarter. Looking forward to continued growth.',
                'status' => $idx < 4 ? 'acknowledged' : 'draft',
            ]);
        }

        // ===================== TRAININGS =====================
        $trainings = [
            ['title' => 'Advanced React & TypeScript Workshop', 'description' => 'Deep dive into modern React patterns, hooks, and TypeScript integration.', 'provider' => 'Tech Academy', 'duration' => 16, 'type' => 'online'],
            ['title' => 'Leadership & Management Skills', 'description' => 'Develop essential leadership skills for managing high-performance teams.', 'provider' => 'HR Development Team', 'duration' => 8, 'type' => 'in-person'],
            ['title' => 'Cybersecurity Awareness Training', 'description' => 'Learn to identify and prevent common security threats in the workplace.', 'provider' => 'IT Security Team', 'duration' => 4, 'type' => 'online'],
            ['title' => 'Agile & Scrum Certification Prep', 'description' => 'Prepare for Scrum Master certification with hands-on workshops.', 'provider' => 'Agile Consulting', 'duration' => 24, 'type' => 'hybrid'],
        ];

        $trainingStatuses = ['upcoming', 'ongoing', 'completed'];
        foreach ($trainings as $idx => $tr) {
            Training::create([
                'title' => $tr['title'],
                'description' => $tr['description'],
                'provider' => $tr['provider'],
                'type' => $tr['type'],
                'start_date' => Carbon::now()->addDays($idx * 7 - 14)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays($idx * 7 - 14 + $tr['duration'] / 8)->format('Y-m-d'),
                'duration_hours' => $tr['duration'],
                'status' => $trainingStatuses[$idx % 3],
            ]);
        }

        // ===================== SETTINGS =====================
        $settings = [
            ['key' => 'company_name', 'value' => 'NexusTech Solutions'],
            ['key' => 'company_address', 'value' => 'Jl. Sudirman No. 123, Jakarta 10220'],
            ['key' => 'company_phone', 'value' => '+62 21 555 1234'],
            ['key' => 'company_email', 'value' => 'info@nexustech.com'],
            ['key' => 'work_hours_start', 'value' => '08:00'],
            ['key' => 'work_hours_end', 'value' => '17:00'],
            ['key' => 'annual_leave_days', 'value' => '14'],
            ['key' => 'sick_leave_days', 'value' => '12'],
        ];

        foreach ($settings as $s) {
            Setting::create($s);
        }

        // ===================== AUDIT LOGS =====================
        $actions = ['created', 'updated', 'deleted'];
        $tables = ['employees', 'leave_requests', 'payrolls', 'announcements'];
        for ($i = 0; $i < 15; $i++) {
            AuditLog::create([
                'user_id' => [$admin->id, $hrManager->id][rand(0, 1)],
                'action' => $actions[rand(0, 2)],
                'table_name' => $tables[rand(0, 3)],
                'record_id' => rand(1, 12),
                'old_values' => json_encode(['status' => 'draft']),
                'new_values' => json_encode(['status' => 'published']),
                'ip_address' => '192.168.1.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'created_at' => Carbon::now()->subHours(rand(1, 168)),
            ]);
        }
    }
}
