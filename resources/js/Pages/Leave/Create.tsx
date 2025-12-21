import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { CalendarDays, Save } from "lucide-react";

interface LeaveBalance {
    annual: number;
    sick: number;
}

interface Props extends PageProps {
    leaveBalance: LeaveBalance;
}

export default function LeaveCreate({ auth, leaveBalance }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/leave");
    };

    return (
        <AppLayout>
            <Head title="Request Leave" />

            <PageHeader
                title="Request Leave"
                subtitle="Submit a new leave request"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Leave", href: "/leave" },
                    { label: "New Request" },
                ]}
            />

            {/* Leave Balance Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-100 p-2">
                            <CalendarDays className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-emerald-700">
                                Annual Leave Balance
                            </p>
                            <p className="text-2xl font-bold text-emerald-800">
                                {leaveBalance.annual} days
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2">
                            <CalendarDays className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-700">
                                Sick Leave Balance
                            </p>
                            <p className="text-2xl font-bold text-amber-800">
                                {leaveBalance.sick} days
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Leave Type *
                            </label>
                            <select
                                value={data.leave_type}
                                onChange={(e) =>
                                    setData("leave_type", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="annual">
                                    Annual Leave ({leaveBalance.annual} days
                                    available)
                                </option>
                                <option value="sick">
                                    Sick Leave ({leaveBalance.sick} days
                                    available)
                                </option>
                                <option value="unpaid">Unpaid Leave</option>
                                <option value="maternity">
                                    Maternity Leave
                                </option>
                                <option value="paternity">
                                    Paternity Leave
                                </option>
                            </select>
                            {errors.leave_type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.leave_type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                min={
                                    data.start_date ||
                                    new Date().toISOString().split("T")[0]
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Reason *
                            </label>
                            <textarea
                                value={data.reason}
                                onChange={(e) =>
                                    setData("reason", e.target.value)
                                }
                                rows={4}
                                placeholder="Please provide a reason for your leave request..."
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.reason && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.reason}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button href="/leave" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Submit Request
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
