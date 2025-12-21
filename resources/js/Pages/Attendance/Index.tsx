import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Clock, MapPin } from "lucide-react";

interface Employee {
    user: { name: string };
}

interface Attendance {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
    employee: Employee;
}

interface PaginatedAttendances {
    data: Attendance[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    attendances: PaginatedAttendances;
    todayAttendance: Attendance | null;
    filters: { date?: string; status?: string };
    canManage: boolean;
}

export default function AttendanceIndex({
    auth,
    attendances,
    todayAttendance,
    filters,
    canManage,
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
                (pos) =>
                    router.post("/attendance/clock-in", {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }),
                () => router.post("/attendance/clock-in", {})
            );
        } else {
            router.post("/attendance/clock-in", {});
        }
    };

    const handleClockOut = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    router.post("/attendance/clock-out", {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }),
                () => router.post("/attendance/clock-out", {})
            );
        } else {
            router.post("/attendance/clock-out", {});
        }
    };

    return (
        <AppLayout>
            <Head title="Attendance" />

            <PageHeader
                title="Attendance"
                subtitle={today}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Attendance" },
                ]}
            />

            {/* Clock In/Out Card */}
            <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Today's Status
                        </h3>
                        {todayAttendance && todayAttendance.check_in && (
                            <p className="mt-1 text-sm text-slate-500">
                                Clock in: {todayAttendance.check_in}
                                {todayAttendance.check_out &&
                                    ` • Clock out: ${todayAttendance.check_out}`}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {!todayAttendance || !todayAttendance.check_in ? (
                            <Button
                                onClick={handleClockIn}
                                icon={<Clock className="h-4 w-4" />}
                            >
                                Clock In
                            </Button>
                        ) : !todayAttendance.check_out ? (
                            <Button
                                onClick={handleClockOut}
                                variant="danger"
                                icon={<Clock className="h-4 w-4" />}
                            >
                                Clock Out
                            </Button>
                        ) : (
                            <StatusBadge status="present" size="md" />
                        )}
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
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
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Clock In
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Clock Out
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attendances.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={canManage ? 5 : 4}
                                        className="px-6 py-16 text-center text-slate-500"
                                    >
                                        <Clock className="mx-auto h-12 w-12 text-slate-300" />
                                        <p className="mt-2">
                                            No attendance records
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                attendances.data.map((att) => (
                                    <tr
                                        key={att.id}
                                        className="hover:bg-slate-50"
                                    >
                                        {canManage && (
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                        {att.employee.user.name.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-slate-900">
                                                        {att.employee.user.name}
                                                    </span>
                                                </div>
                                            </td>
                                        )}
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {att.date}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {att.check_in || "--:--"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {att.check_out || "--:--"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge status={att.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
