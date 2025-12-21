<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Training extends Model
{
    protected $fillable = [
        'title',
        'description',
        'provider',
        'type',
        'start_date',
        'end_date',
        'duration_hours',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_trainings')
            ->withPivot('status', 'score', 'certificate_url', 'completed_at')
            ->withTimestamps();
    }
}
