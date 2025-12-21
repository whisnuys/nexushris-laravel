<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    private $defaults = [
        'company_name' => 'NexusHRIS',
        'company_email' => 'hr@company.com',
        'company_phone' => '+62 21 1234 5678',
        'company_address' => 'Jl. Sudirman No. 123, Jakarta',
        'leave_annual_days' => '12',
        'leave_sick_days' => '12',
        'leave_carry_over_limit' => '5',
        'payroll_tax_rate' => '5',
        'payroll_social_security_rate' => '2',
        'payroll_health_insurance' => '100000',
        'payroll_overtime_rate' => '50000',
        'attendance_work_start' => '09:00',
        'attendance_work_end' => '18:00',
        'attendance_late_threshold' => '15',
    ];

    public function index()
    {
        $settings = [];
        foreach ($this->defaults as $key => $default) {
            $settings[$key] = Setting::get($key, $default);
        }

        return Inertia::render('Settings/Index', [
            'settings' => [
                'company' => [
                    'name' => $settings['company_name'],
                    'email' => $settings['company_email'],
                    'phone' => $settings['company_phone'],
                    'address' => $settings['company_address'],
                ],
                'leave' => [
                    'annual_days' => (int) $settings['leave_annual_days'],
                    'sick_days' => (int) $settings['leave_sick_days'],
                    'carry_over_limit' => (int) $settings['leave_carry_over_limit'],
                ],
                'payroll' => [
                    'tax_rate' => (int) $settings['payroll_tax_rate'],
                    'social_security_rate' => (int) $settings['payroll_social_security_rate'],
                    'health_insurance' => (int) $settings['payroll_health_insurance'],
                    'overtime_rate' => (int) $settings['payroll_overtime_rate'],
                ],
                'attendance' => [
                    'work_start' => $settings['attendance_work_start'],
                    'work_end' => $settings['attendance_work_end'],
                    'late_threshold' => (int) $settings['attendance_late_threshold'],
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'annual_days' => 'nullable|integer|min:0',
            'sick_days' => 'nullable|integer|min:0',
            'carry_over_limit' => 'nullable|integer|min:0',
            'tax_rate' => 'nullable|integer|min:0|max:100',
            'social_security_rate' => 'nullable|integer|min:0|max:100',
            'health_insurance' => 'nullable|integer|min:0',
            'overtime_rate' => 'nullable|integer|min:0',
            'work_start' => 'nullable|string',
            'work_end' => 'nullable|string',
            'late_threshold' => 'nullable|integer|min:0',
        ]);

        $mappings = [
            'name' => 'company_name',
            'email' => 'company_email',
            'phone' => 'company_phone',
            'address' => 'company_address',
            'annual_days' => 'leave_annual_days',
            'sick_days' => 'leave_sick_days',
            'carry_over_limit' => 'leave_carry_over_limit',
            'tax_rate' => 'payroll_tax_rate',
            'social_security_rate' => 'payroll_social_security_rate',
            'health_insurance' => 'payroll_health_insurance',
            'overtime_rate' => 'payroll_overtime_rate',
            'work_start' => 'attendance_work_start',
            'work_end' => 'attendance_work_end',
            'late_threshold' => 'attendance_late_threshold',
        ];

        foreach ($validated as $field => $value) {
            if ($value !== null && isset($mappings[$field])) {
                Setting::set($mappings[$field], (string) $value);
            }
        }

        return redirect()->back()->with('success', 'Settings saved successfully!');
    }
}
