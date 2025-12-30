import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatsCard from "@/Components/StatsCard";
import { PageProps } from "@/types";
import {
    Users,
    Clock,
    CalendarDays,
    DollarSign,
    TrendingUp,
    Percent,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface AttendanceStats {
    present: number;
    late: number;
    absent: number;
    attendanceRate: number;
}

interface LeaveStats {
    pending: number;
    approved: number;
    rejected: number;
}

interface PayrollStats {
    totalGross: number;
    totalDeductions: number;
    totalNet: number;
    processed: number;
    paid: number;
    draft: number;
}

interface DepartmentData {
    department: string;
    count: number;
}

interface TrendData {
    month: string;
    present?: number;
    amount?: number;
}

interface Props extends PageProps {
    attendanceStats: AttendanceStats;
    leaveStats: LeaveStats;
    payrollStats: PayrollStats;
    departmentDistribution: DepartmentData[];
    attendanceTrend: TrendData[];
    payrollTrend: TrendData[];
}

export default function ReportsIndex({
    auth,
    attendanceStats,
    leaveStats,
    payrollStats,
    departmentDistribution,
    attendanceTrend,
    payrollTrend,
}: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    const totalEmployees = departmentDistribution.reduce(
        (sum, d) => sum + d.count,
        0
    );

    return (
        <AppLayout>
            <Head title="Reports" />

            <PageHeader
                title="Reports & Analytics"
                subtitle="Overview of your organization's key metrics"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Reports" },
                ]}
            />

            {/* Quick Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Attendance Rate"
                    value={`${attendanceStats.attendanceRate}%`}
                    icon={Percent}
                    color="green"
                />
                <StatsCard
                    title="Pending Leaves"
                    value={leaveStats.pending}
                    icon={CalendarDays}
                    color="yellow"
                />
                <StatsCard
                    title="Total Employees"
                    value={totalEmployees}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Net Payroll"
                    value={formatCurrency(payrollStats.totalNet)}
                    icon={DollarSign}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Attendance Overview */}
                <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                        Attendance This Month
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/40">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {attendanceStats.present}
                            </p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                Present
                            </p>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/40">
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {attendanceStats.late}
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Late
                            </p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/40">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {attendanceStats.absent}
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Absent
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex-1 flex flex-col min-h-0">
                        <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                            Attendance Trend (6 months)
                        </p>
                        <div className="flex-1 min-h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={attendanceTrend.map((item) => ({
                                        name: item.month.split(" ")[0],
                                        value: item.present || 0,
                                    }))}
                                    margin={{
                                        top: 5,
                                        right: 10,
                                        left: 10,
                                        bottom: 5,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorAttendance"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                        formatter={(value: any) => [
                                            value,
                                            "Present",
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorAttendance)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Leave Overview */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                        Leave Requests This Month
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/40">
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {leaveStats.pending}
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Pending
                            </p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/40">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {leaveStats.approved}
                            </p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                Approved
                            </p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/40">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {leaveStats.rejected}
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Rejected
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                            Employees by Department
                        </p>
                        <div className="space-y-3">
                            {departmentDistribution.map((dept, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {dept.department}
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {dept.count}
                                        </span>
                                    </div>
                                    <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                                        <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{
                                                width: `${
                                                    (dept.count /
                                                        totalEmployees) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payroll Overview */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                        Payroll Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Gross Salary
                            </p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(payrollStats.totalGross)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Deductions
                            </p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                -{formatCurrency(payrollStats.totalDeductions)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Net Payroll
                            </p>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(payrollStats.totalNet)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Status
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                <span className="font-medium">
                                    {payrollStats.paid}
                                </span>{" "}
                                paid,{" "}
                                <span className="font-medium">
                                    {payrollStats.processed}
                                </span>{" "}
                                processed,{" "}
                                <span className="font-medium">
                                    {payrollStats.draft}
                                </span>{" "}
                                draft
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                            Payroll Trend (6 months)
                        </p>
                        <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={payrollTrend.map((item) => ({
                                        name: item.month.split(" ")[0],
                                        value: item.amount || 0,
                                    }))}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: 5,
                                        bottom: 5,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorPayroll"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#a855f7"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#a855f7"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                        formatter={(
                                            value: number | undefined
                                        ) => [
                                            formatCurrency(value || 0),
                                            "Net Payroll",
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#a855f7"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPayroll)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
