import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatsCard from "@/Components/StatsCard";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import {
    Clock,
    CalendarDays,
    DollarSign,
    MapPin,
    User,
    Briefcase,
} from "lucide-react";

interface Employee {
    id: number;
    employee_code: string;
    job_title: string;
    department: string;
    annual_leave_balance: number;
    sick_leave_balance: number;
}

interface LeaveBalance {
    annual: number;
    sick: number;
}

interface Attendance {
    id: number;
    check_in: string | null;
    check_out: string | null;
    status: string;
}

interface LeaveRequest {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface Payroll {
    id: number;
    month: number;
    year: number;
    net_salary: number;
    status: string;
}

interface Props extends PageProps {
    employee: Employee;
    todayAttendance: Attendance | null;
    leaveBalance: LeaveBalance;
    recentLeaves: LeaveRequest[];
    latestPayroll: Payroll | null;
}

export default function EmployeeDashboard({
    auth,
    employee,
    todayAttendance,
    leaveBalance,
    recentLeaves,
    latestPayroll,
}: Props) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleClockIn = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.post("/attendance/clock-in", {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                () => router.post("/attendance/clock-in", {})
            );
        } else {
            router.post("/attendance/clock-in", {});
        }
    };

    const handleClockOut = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.post("/attendance/clock-out", {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                () => router.post("/attendance/clock-out", {})
            );
        } else {
            router.post("/attendance/clock-out", {});
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Welcome back, {auth.user.name}!
                        </h1>
                        <p className="mt-1 text-blue-100">{today}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-blue-100">
                            <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {employee.job_title}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {employee.employee_code}
                            </span>
                        </div>
                    </div>

                    {/* Clock In/Out */}
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                        <p className="mb-2 text-sm text-blue-100">
                            Today's Attendance
                        </p>
                        {todayAttendance ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-8 text-sm">
                                    <span>
                                        In:{" "}
                                        {todayAttendance.check_in || "--:--"}
                                    </span>
                                    <span>
                                        Out:{" "}
                                        {todayAttendance.check_out || "--:--"}
                                    </span>
                                </div>
                                {!todayAttendance.check_out && (
                                    <button
                                        onClick={handleClockOut}
                                        className="mt-2 w-full rounded-lg bg-red-500 py-2 font-medium text-white transition-colors hover:bg-red-600"
                                    >
                                        Clock Out
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleClockIn}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
                            >
                                <Clock className="h-5 w-5" />
                                Clock In Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Annual Leave"
                    value={`${leaveBalance.annual} days`}
                    icon={CalendarDays}
                    color="green"
                />
                <StatsCard
                    title="Sick Leave"
                    value={`${leaveBalance.sick} days`}
                    icon={CalendarDays}
                    color="yellow"
                />
                <StatsCard
                    title="Latest Salary"
                    value={
                        latestPayroll
                            ? formatCurrency(latestPayroll.net_salary)
                            : "N/A"
                    }
                    icon={DollarSign}
                    color="purple"
                    href={
                        latestPayroll
                            ? `/payroll/${latestPayroll.id}`
                            : undefined
                    }
                />
                <StatsCard
                    title="Department"
                    value={employee.department}
                    icon={User}
                    color="blue"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Leave Requests */}
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="font-semibold text-slate-900">
                            My Leave Requests
                        </h2>
                        <Link
                            href="/leave/create"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            + New Request
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentLeaves.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
                                <p className="mt-2">No leave requests yet</p>
                                <Button
                                    href="/leave/create"
                                    variant="primary"
                                    size="sm"
                                    className="mt-4"
                                >
                                    Request Leave
                                </Button>
                            </div>
                        ) : (
                            recentLeaves.map((leave) => (
                                <div
                                    key={leave.id}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <div>
                                        <p className="font-medium capitalize text-slate-900">
                                            {leave.leave_type} Leave
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {leave.start_date} -{" "}
                                            {leave.end_date}
                                        </p>
                                    </div>
                                    <StatusBadge status={leave.status} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 font-semibold text-slate-900">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/leave/create"
                            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-6 transition-colors hover:border-blue-500 hover:bg-blue-50"
                        >
                            <CalendarDays className="h-8 w-8 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700">
                                Request Leave
                            </span>
                        </Link>
                        <Link
                            href="/attendance"
                            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-6 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                        >
                            <Clock className="h-8 w-8 text-emerald-600" />
                            <span className="text-sm font-medium text-slate-700">
                                My Attendance
                            </span>
                        </Link>
                        <Link
                            href="/payroll"
                            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-6 transition-colors hover:border-purple-500 hover:bg-purple-50"
                        >
                            <DollarSign className="h-8 w-8 text-purple-600" />
                            <span className="text-sm font-medium text-slate-700">
                                View Payslips
                            </span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-6 transition-colors hover:border-slate-500 hover:bg-slate-50"
                        >
                            <User className="h-8 w-8 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">
                                My Profile
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
