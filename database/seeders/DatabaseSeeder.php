<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@hris.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '+62 812 3456 7890',
        ]);

        // Create HR Manager
        $hrManager = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@hris.com',
            'password' => bcrypt('password'),
            'role' => 'hr_manager',
            'phone' => '+62 812 3456 7891',
        ]);

        // Create Sample Employee
        $employeeUser = User::create([
            'name' => 'John Doe',
            'email' => 'employee@hris.com',
            'password' => bcrypt('password'),
            'role' => 'employee',
            'phone' => '+62 812 3456 7892',
        ]);

        // Create Employee record
        Employee::create([
            'user_id' => $employeeUser->id,
            'employee_code' => 'EMP001',
            'job_title' => 'Software Developer',
            'department' => 'Engineering',
            'manager_id' => $hrManager->id,
            'salary_basic' => 10000000,
            'salary_allowances' => 2000000,
            'join_date' => '2024-01-15',
            'status' => 'active',
            'annual_leave_balance' => 12,
            'sick_leave_balance' => 12,
            'address' => 'Jl. Contoh No. 123',
            'city' => 'Jakarta',
            'postal_code' => '12345',
        ]);
    }
}
