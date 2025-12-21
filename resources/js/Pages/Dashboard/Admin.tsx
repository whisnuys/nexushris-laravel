import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatsCard from "@/Components/StatsCard";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import {
    Users,
    Clock,
    CalendarDays,
    DollarSign,
    ArrowRight,
    CheckCircle,
    XCircle,
    MoreHorizontal,
} from "lucide-react";

interface Stats {
    totalEmployees: number;
    presentToday: number;
    pendingLeaves: number;
    processedPayrolls: number;
}

interface LeaveRequest {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    employee: {
        user: {
            name: string;
        };
    };
}

interface Attendance {
    id: number;
    check_in: string | null;
    check_out: string | null;
    status: string;
    employee: {
        user: {
            name: string;
        };
    };
}

interface Props extends PageProps {
    stats: Stats;
    recentLeaveRequests: LeaveRequest[];
    recentAttendance: Attendance[];
}

export default function AdminDashboard({
    auth,
    stats,
    recentLeaveRequests,
    recentAttendance,
}: Props) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <PageHeader
                title={`Good ${
                    new Date().getHours() < 12
                        ? "morning"
                        : new Date().getHours() < 18
                        ? "afternoon"
                        : "evening"
                }, ${auth.user.name}!`}
                subtitle={today}
            />

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="blue"
                    href="/employees"
                />
                <StatsCard
                    title="Present Today"
                    value={stats.presentToday}
                    icon={Clock}
                    color="green"
                    href="/attendance"
                />
                <StatsCard
                    title="Pending Leaves"
                    value={stats.pendingLeaves}
                    icon={CalendarDays}
                    color="yellow"
                    href="/leave"
                />
                <StatsCard
                    title="Payrolls Processed"
                    value={stats.processedPayrolls}
                    icon={DollarSign}
                    color="purple"
                    href="/payroll"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pending Leave Requests */}
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="font-semibold text-slate-900">
                            Pending Leave Requests
                        </h2>
                        <Link
                            href="/leave"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentLeaveRequests.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
                                <p className="mt-2">No pending requests</p>
                            </div>
                        ) : (
                            recentLeaveRequests.map((leave) => (
                                <div
                                    key={leave.id}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-slate-900">
                                            {leave.employee.user.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {leave.leave_type} •{" "}
                                            {leave.total_days} days •{" "}
                                            {leave.start_date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                router.post(
                                                    `/leave/${leave.id}/approve`
                                                )
                                            }
                                            className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </button>
                                        <button className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50">
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Today's Attendance */}
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="font-semibold text-slate-900">
                            Today's Attendance
                        </h2>
                        <Link
                            href="/attendance"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentAttendance.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <Clock className="mx-auto h-12 w-12 text-slate-300" />
                                <p className="mt-2">
                                    No attendance records today
                                </p>
                            </div>
                        ) : (
                            recentAttendance.slice(0, 5).map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600">
                                            {att.employee.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {att.employee.user.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {att.check_in || "--:--"} →{" "}
                                                {att.check_out || "--:--"}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={att.status} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 font-semibold text-slate-900">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Button
                        href="/employees/create"
                        variant="secondary"
                        icon={<Users className="h-4 w-4" />}
                    >
                        Add Employee
                    </Button>
                    <Button
                        href="/payroll/create"
                        variant="secondary"
                        icon={<DollarSign className="h-4 w-4" />}
                    >
                        Create Payroll
                    </Button>
                    <Button
                        href="/leave"
                        variant="secondary"
                        icon={<CalendarDays className="h-4 w-4" />}
                    >
                        Manage Leaves
                    </Button>
                    <Button
                        href="/attendance"
                        variant="secondary"
                        icon={<Clock className="h-4 w-4" />}
                    >
                        View Attendance
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
