import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { PageProps } from "@/types";
import { useState } from "react";

interface Employee {
    id: number;
    name: string;
    job_title: string;
    department: string;
    manager_id: number | null;
    avatar: string;
}

interface Props extends PageProps {
    employees: Employee[];
    departments: string[];
}

export default function OrganizationIndex({
    auth,
    employees,
    departments,
}: Props) {
    const [selectedDept, setSelectedDept] = useState<string>("all");

    // Filter employees by department
    const filteredEmployees =
        selectedDept === "all"
            ? employees
            : employees.filter((e) => e.department === selectedDept);

    // Build hierarchy - find root employees (no manager or manager not in list)
    const buildTree = (emps: Employee[]) => {
        const empIds = new Set(emps.map((e) => e.id));
        const roots = emps.filter(
            (e) => !e.manager_id || !empIds.has(e.manager_id)
        );

        const getChildren = (parentId: number): Employee[] => {
            return emps.filter((e) => e.manager_id === parentId);
        };

        return { roots, getChildren };
    };

    const { roots, getChildren } = buildTree(filteredEmployees);

    const EmployeeCard = ({
        employee,
        level = 0,
    }: {
        employee: Employee;
        level?: number;
    }) => {
        const children = getChildren(employee.id);

        return (
            <div className="flex flex-col items-center">
                {/* Card */}
                <Link
                    href={`/employees/${employee.id}`}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
                            {employee.avatar}
                        </div>
                        <p className="mt-2 font-medium text-slate-900 group-hover:text-blue-600">
                            {employee.name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {employee.job_title}
                        </p>
                        <span className="mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {employee.department}
                        </span>
                    </div>
                </Link>

                {/* Children */}
                {children.length > 0 && (
                    <div className="mt-4 flex flex-col items-center">
                        <div className="h-6 w-px bg-slate-300" />
                        <div className="flex gap-8">
                            {children.map((child) => (
                                <div
                                    key={child.id}
                                    className="flex flex-col items-center"
                                >
                                    <div className="h-6 w-px bg-slate-300" />
                                    <EmployeeCard
                                        employee={child}
                                        level={level + 1}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Organization Chart" />

            <PageHeader
                title="Organization Chart"
                subtitle={`${employees.length} employees across ${departments.length} departments`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Organization" },
                ]}
            />

            {/* Department Filter */}
            <div className="mb-6 flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                    Filter by Department:
                </label>
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-8">
                {filteredEmployees.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                        No employees found
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {roots.map((root) => (
                            <EmployeeCard key={root.id} employee={root} />
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                    <strong>Tip:</strong> Click on an employee card to view
                    their full profile. Employees are organized by reporting
                    structure.
                </p>
            </div>
        </AppLayout>
    );
}
