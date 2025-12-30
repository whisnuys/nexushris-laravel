import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import StatusBadge from "@/Components/StatusBadge";
import { PageProps } from "@/types";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    BookOpen,
    Plus,
    Check,
    X,
} from "lucide-react";
import { useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    user: User;
    department: string;
    job_title: string;
    pivot?: {
        status: string;
        score: number | null;
        completed_at: string | null;
    };
}

interface Training {
    id: number;
    title: string;
    description: string | null;
    provider: string | null;
    type: string;
    start_date: string | null;
    end_date: string | null;
    duration_hours: number | null;
    status: string;
    employees: Employee[];
}

interface Props extends PageProps {
    training: Training;
    allEmployees: Employee[];
    canManage: boolean;
}

export default function TrainingShow({
    training,
    allEmployees,
    canManage,
}: Props) {
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(
        null
    );

    const enrolledIds = training.employees.map((e) => e.id);
    const availableEmployees = allEmployees.filter(
        (e) => !enrolledIds.includes(e.id)
    );

    const handleEnroll = () => {
        if (selectedEmployee) {
            router.post(`/trainings/${training.id}/enroll`, {
                employee_id: selectedEmployee,
            });
            setEnrollModalOpen(false);
            setSelectedEmployee(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
            case "in_progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
            case "enrolled":
                return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
            case "failed":
                return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
        }
    };

    return (
        <AppLayout>
            <Head title={training.title} />

            <PageHeader
                title={training.title}
                subtitle={training.description || "Training program details"}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Trainings", href: "/trainings" },
                    { label: training.title },
                ]}
                actions={
                    <Link
                        href="/trainings"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Trainings
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Training Info Card */}
                <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                        Training Details
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/40">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Provider
                                </p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {training.provider || "Internal"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/40">
                                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Date
                                </p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {training.start_date
                                        ? new Date(
                                              training.start_date
                                          ).toLocaleDateString()
                                        : "TBD"}
                                    {training.end_date &&
                                        ` - ${new Date(
                                            training.end_date
                                        ).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/40">
                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Duration
                                </p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {training.duration_hours
                                        ? `${training.duration_hours} hours`
                                        : "TBD"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/40">
                                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Enrolled
                                </p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {training.employees.length} participants
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                Type
                            </p>
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {training.type}
                            </span>
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                Status
                            </p>
                            <StatusBadge status={training.status} />
                        </div>
                    </div>
                </div>

                {/* Enrolled Employees */}
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Enrolled Employees
                        </h3>
                        {canManage && availableEmployees.length > 0 && (
                            <Button
                                onClick={() => setEnrollModalOpen(true)}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Enroll Employee
                            </Button>
                        )}
                    </div>

                    {training.employees.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                            <Users className="mx-auto h-10 w-10 mb-2 opacity-50" />
                            <p>No employees enrolled yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Employee
                                        </th>
                                        <th className="py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Department
                                        </th>
                                        <th className="py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Status
                                        </th>
                                        <th className="py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {training.employees.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className="border-b border-slate-100 dark:border-slate-700"
                                        >
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                                        {emp.user.name.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {emp.user.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {emp.job_title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-600 dark:text-slate-300">
                                                {emp.department}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(
                                                        emp.pivot?.status ||
                                                            "enrolled"
                                                    )}`}
                                                >
                                                    {emp.pivot?.status?.replace(
                                                        "_",
                                                        " "
                                                    ) || "enrolled"}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-600 dark:text-slate-300">
                                                {emp.pivot?.score !== null &&
                                                emp.pivot?.score !== undefined
                                                    ? `${emp.pivot.score}%`
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Enroll Modal */}
            {enrollModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-slate-800">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Enroll Employee
                        </h3>
                        <select
                            value={selectedEmployee || ""}
                            onChange={(e) =>
                                setSelectedEmployee(Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-200 p-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Select an employee</option>
                            {availableEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.user.name} - {emp.department}
                                </option>
                            ))}
                        </select>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setEnrollModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEnroll}
                                disabled={!selectedEmployee}
                            >
                                Enroll
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
