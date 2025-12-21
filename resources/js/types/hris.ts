// Database types for HRIS
export type UserRole = "admin" | "hr_manager" | "employee";
export type EmploymentStatus =
    | "active"
    | "on_leave"
    | "resigned"
    | "terminated";
export type AttendanceStatus = "present" | "late" | "absent" | "on_leave";
export type LeaveType =
    | "annual"
    | "sick"
    | "unpaid"
    | "maternity"
    | "paternity";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type PayrollStatus = "draft" | "processed" | "paid";

export interface Profile {
    id: number;
    name: string;
    full_name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar_url?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    employee?: Employee;
}

export interface Employee {
    id: number;
    user_id: number;
    employee_code: string;
    job_title: string;
    department: string;
    manager_id?: number;
    salary_basic: number;
    salary_allowances: number;
    join_date: string;
    resignation_date?: string;
    status: EmploymentStatus;
    annual_leave_balance: number;
    sick_leave_balance: number;
    address?: string;
    city?: string;
    postal_code?: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    check_in_latitude?: number;
    check_in_longitude?: number;
    check_out_latitude?: number;
    check_out_longitude?: number;
    status: AttendanceStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
    employee?: Employee;
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: LeaveStatus;
    approver_id?: number;
    approved_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
    employee?: Employee;
    approver?: User;
}

export interface Payroll {
    id: number;
    employee_id: number;
    month: number;
    year: number;
    basic_salary: number;
    allowances: number;
    overtime_pay: number;
    bonus: number;
    gross_salary: number;
    tax: number;
    social_security: number;
    health_insurance: number;
    other_deductions: number;
    total_deductions: number;
    net_salary: number;
    status: PayrollStatus;
    payment_date?: string;
    payslip_url?: string;
    created_at: string;
    updated_at: string;
    employee?: Employee;
}

export interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}
