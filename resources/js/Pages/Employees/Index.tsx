import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Filter,
    Download,
} from "lucide-react";
import { useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

interface Employee {
    id: number;
    user_id: number;
    employee_code: string;
    job_title: string;
    department: string;
    status: string;
    join_date: string;
    user: User;
}

interface PaginatedEmployees {
    data: Employee[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    total: number;
}

interface Props extends PageProps {
    employees: PaginatedEmployees;
    departments: string[];
    filters: {
        search?: string;
        status?: string;
        department?: string;
    };
}

export default function EmployeesIndex({
    auth,
    employees,
    departments,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get("/employees", { search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(
            "/employees",
            { ...filters, [key]: value },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `Are you sure you want to delete ${name}? This action cannot be undone.`
            )
        ) {
            router.delete(`/employees/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Employees" />

            <PageHeader
                title="Employees"
                subtitle={`${employees.total} employees in your organization`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Employees" },
                ]}
                actions={
                    <Button
                        href="/employees/create"
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Add Employee
                    </Button>
                }
            />

            {/* Filters */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or employee code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </form>

                    <select
                        value={filters.status || "all"}
                        onChange={(e) => handleFilter("status", e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="resigned">Resigned</option>
                        <option value="terminated">Terminated</option>
                    </select>

                    <select
                        value={filters.department || "all"}
                        onChange={(e) =>
                            handleFilter("department", e.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Position
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="mx-auto max-w-sm">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                                <Search className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500">
                                                No employees found
                                            </p>
                                            <Button
                                                href="/employees/create"
                                                variant="primary"
                                                size="sm"
                                                className="mt-4"
                                            >
                                                Add your first employee
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                employees.data.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
                                                    {employee.user.name.charAt(
                                                        0
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {employee.user.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {employee.employee_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {employee.job_title}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {employee.department}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge
                                                status={employee.status}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {employee.join_date}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/employees/${employee.id}`}
                                                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/employees/${employee.id}/edit`}
                                                    className="rounded-lg p-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            employee.id,
                                                            employee.user.name
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {employees.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                        <p className="text-sm text-slate-500">
                            Page {employees.current_page} of{" "}
                            {employees.last_page}
                        </p>
                        <div className="flex gap-1">
                            {employees.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : link.url
                                            ? "text-slate-600 hover:bg-slate-100"
                                            : "cursor-not-allowed text-slate-300"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
