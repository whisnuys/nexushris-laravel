<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_code',
        'job_title',
        'department',
        'manager_id',
        'salary_basic',
        'salary_allowances',
        'join_date',
        'resignation_date',
        'status',
        'annual_leave_balance',
        'sick_leave_balance',
        'address',
        'city',
        'postal_code',
    ];

    protected $casts = [
        'salary_basic' => 'decimal:2',
        'salary_allowances' => 'decimal:2',
        'join_date' => 'date',
        'resignation_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }
}
