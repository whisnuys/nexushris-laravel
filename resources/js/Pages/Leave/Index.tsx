import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatsCard from "@/Components/StatsCard";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Plus, CheckCircle, XCircle, CalendarDays } from "lucide-react";
import { useState } from "react";

interface Employee {
    user: { name: string };
}

interface LeaveRequest {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: string;
    employee: Employee;
}

interface PaginatedLeaves {
    data: LeaveRequest[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface LeaveBalance {
    annual: number;
    sick: number;
}

interface Props extends PageProps {
    leaves: PaginatedLeaves;
    leaveBalance: LeaveBalance | null;
    filters: { status?: string; type?: string };
    canManage: boolean;
}

export default function LeaveIndex({
    auth,
    leaves,
    leaveBalance,
    filters,
    canManage,
}: Props) {
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const handleApprove = (id: number) => router.post(`/leave/${id}/approve`);
    const handleReject = (id: number) => {
        router.post(`/leave/${id}/reject`, { rejection_reason: rejectReason });
        setRejectingId(null);
        setRejectReason("");
    };

    return (
        <AppLayout>
            <Head title="Leave Requests" />

            <PageHeader
                title="Leave Requests"
                subtitle="Manage employee leave requests"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Leave" },
                ]}
                actions={
                    <Button
                        href="/leave/create"
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Request Leave
                    </Button>
                }
            />

            {/* Leave Balance */}
            {leaveBalance && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                </div>
            )}

            {/* Leave Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50">
                                {canManage && (
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Employee
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Period
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Days
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                {canManage && (
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaves.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={canManage ? 6 : 4}
                                        className="px-6 py-16 text-center text-slate-500"
                                    >
                                        <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
                                        <p className="mt-2">
                                            No leave requests
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                leaves.data.map((leave) => (
                                    <tr
                                        key={leave.id}
                                        className="hover:bg-slate-50"
                                    >
                                        {canManage && (
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                                {leave.employee.user.name}
                                            </td>
                                        )}
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700">
                                                {leave.leave_type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {leave.start_date} -{" "}
                                            {leave.end_date}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {leave.total_days}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge
                                                status={leave.status}
                                            />
                                        </td>
                                        {canManage && (
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                {leave.status === "pending" && (
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    leave.id
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setRejectingId(
                                                                    leave.id
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Reject Leave Request
                        </h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="mb-4 w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                            rows={3}
                        />
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setRejectingId(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleReject(rejectingId)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
