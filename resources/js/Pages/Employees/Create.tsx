import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save, ArrowLeft } from "lucide-react";

interface User {
    id: number;
    name: string;
}

interface Props extends PageProps {
    managers: User[];
    departments: string[];
}

export default function EmployeesCreate({
    auth,
    managers,
    departments,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        employee_code: "",
        job_title: "",
        department: "",
        manager_id: "",
        salary_basic: "",
        salary_allowances: "",
        join_date: "",
        address: "",
        city: "",
        postal_code: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/employees");
    };

    return (
        <AppLayout>
            <Head title="Add Employee" />

            <PageHeader
                title="Add New Employee"
                subtitle="Create a new employee record"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Employees", href: "/employees" },
                    { label: "Add Employee" },
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
                                placeholder="John Doe"
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
                                placeholder="john@company.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Password *
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
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
                                placeholder="+62 812 3456 7890"
                            />
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
                                Employee Code *
                            </label>
                            <input
                                type="text"
                                value={data.employee_code}
                                onChange={(e) =>
                                    setData("employee_code", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="EMP002"
                            />
                            {errors.employee_code && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.employee_code}
                                </p>
                            )}
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
                                placeholder="Software Developer"
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
                                placeholder="Engineering"
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
                                <option value="">Select manager</option>
                                {managers.map((mgr) => (
                                    <option key={mgr.id} value={mgr.id}>
                                        {mgr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Join Date *
                            </label>
                            <input
                                type="date"
                                value={data.join_date}
                                onChange={(e) =>
                                    setData("join_date", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.join_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.join_date}
                                </p>
                            )}
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
                                placeholder="10000000"
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
                                placeholder="2000000"
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
                    <Button href="/employees" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Save Employee
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
