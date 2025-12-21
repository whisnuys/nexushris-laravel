<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('employee_code')->unique();
            $table->string('job_title');
            $table->string('department');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('salary_basic', 15, 2)->default(0);
            $table->decimal('salary_allowances', 15, 2)->default(0);
            $table->date('join_date');
            $table->date('resignation_date')->nullable();
            $table->enum('status', ['active', 'on_leave', 'resigned', 'terminated'])->default('active');
            $table->integer('annual_leave_balance')->default(12);
            $table->integer('sick_leave_balance')->default(12);
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
