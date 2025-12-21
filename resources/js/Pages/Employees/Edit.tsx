import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save } from "lucide-react";

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
    manager_id: number | null;
    salary_basic: number;
    salary_allowances: number;
    status: string;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    user: User;
}

interface Props extends PageProps {
    employee: Employee;
    managers: User[];
    departments: string[];
}

export default function EmployeesEdit({
    auth,
    employee,
    managers,
    departments,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.user.name,
        email: employee.user.email,
        phone: employee.user.phone || "",
        job_title: employee.job_title,
        department: employee.department,
        manager_id: employee.manager_id?.toString() || "",
        salary_basic: employee.salary_basic.toString(),
        salary_allowances: employee.salary_allowances.toString(),
        status: employee.status,
        address: employee.address || "",
        city: employee.city || "",
        postal_code: employee.postal_code || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Employee" />

            <PageHeader
                title="Edit Employee"
                subtitle={`Update information for ${employee.user.name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Employees", href: "/employees" },
                    {
                        label: employee.user.name,
                        href: `/employees/${employee.id}`,
                    },
                    { label: "Edit" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Status *
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="on_leave">On Leave</option>
                                <option value="resigned">Resigned</option>
                                <option value="terminated">Terminated</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Employment Details */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Employment Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Employee Code
                            </label>
                            <input
                                type="text"
                                value={employee.employee_code}
                                disabled
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                value={data.job_title}
                                onChange={(e) =>
                                    setData("job_title", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.job_title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.job_title}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Department *
                            </label>
                            <input
                                type="text"
                                value={data.department}
                                onChange={(e) =>
                                    setData("department", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                list="departments"
                            />
                            <datalist id="departments">
                                {departments.map((dept) => (
                                    <option key={dept} value={dept} />
                                ))}
                            </datalist>
                            {errors.department && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.department}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Manager
                            </label>
                            <select
                                value={data.manager_id}
                                onChange={(e) =>
                                    setData("manager_id", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">No manager</option>
                                {managers.map((mgr) => (
                                    <option key={mgr.id} value={mgr.id}>
                                        {mgr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Salary Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Basic Salary *
                            </label>
                            <input
                                type="number"
                                value={data.salary_basic}
                                onChange={(e) =>
                                    setData("salary_basic", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.salary_basic && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.salary_basic}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Allowances *
                            </label>
                            <input
                                type="number"
                                value={data.salary_allowances}
                                onChange={(e) =>
                                    setData("salary_allowances", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.salary_allowances && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.salary_allowances}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Address
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-3">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Street Address
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                City
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData("postal_code", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        href={`/employees/${employee.id}`}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
