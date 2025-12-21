import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import {
    Edit,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    User,
} from "lucide-react";

interface Manager {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    employee_code: string;
    job_title: string;
    department: string;
    status: string;
    join_date: string;
    salary_basic: number;
    salary_allowances: number;
    annual_leave_balance: number;
    sick_leave_balance: number;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    manager: Manager | null;
}

interface Props extends PageProps {
    employee: Employee;
}

export default function EmployeesShow({ auth, employee }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <AppLayout>
            <Head title={employee.user.name} />

            <PageHeader
                title={employee.user.name}
                subtitle={`${employee.job_title} • ${employee.department}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Employees", href: "/employees" },
                    { label: employee.user.name },
                ]}
                actions={
                    <Button
                        href={`/employees/${employee.id}/edit`}
                        icon={<Edit className="h-4 w-4" />}
                    >
                        Edit Employee
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <div className="text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                                {employee.user.name.charAt(0)}
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-slate-900">
                                {employee.user.name}
                            </h2>
                            <p className="text-slate-500">
                                {employee.employee_code}
                            </p>
                            <div className="mt-2">
                                <StatusBadge
                                    status={employee.status}
                                    size="md"
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">
                                    {employee.user.email}
                                </span>
                            </div>
                            {employee.user.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                        {employee.user.phone}
                                    </span>
                                </div>
                            )}
                            {employee.address && (
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                        {employee.address}
                                        {employee.city && `, ${employee.city}`}
                                        {employee.postal_code &&
                                            ` ${employee.postal_code}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Employment Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-slate-900">
                            Employment Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Job Title
                                </p>
                                <p className="font-medium text-slate-900">
                                    {employee.job_title}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Department
                                </p>
                                <p className="font-medium text-slate-900">
                                    {employee.department}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Manager
                                </p>
                                <p className="font-medium text-slate-900">
                                    {employee.manager?.name || "None"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Join Date
                                </p>
                                <p className="font-medium text-slate-900">
                                    {employee.join_date}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Salary Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-slate-900">
                            Compensation
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Basic Salary
                                </p>
                                <p className="text-xl font-bold text-slate-900">
                                    {formatCurrency(employee.salary_basic)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Allowances
                                </p>
                                <p className="text-xl font-bold text-slate-900">
                                    {formatCurrency(employee.salary_allowances)}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-slate-500">
                                    Total Monthly
                                </p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {formatCurrency(
                                        employee.salary_basic +
                                            employee.salary_allowances
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Leave Balance */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-slate-900">
                            Leave Balance
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-lg bg-emerald-50 p-4">
                                <p className="text-sm text-emerald-700">
                                    Annual Leave
                                </p>
                                <p className="text-2xl font-bold text-emerald-800">
                                    {employee.annual_leave_balance} days
                                </p>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-4">
                                <p className="text-sm text-amber-700">
                                    Sick Leave
                                </p>
                                <p className="text-2xl font-bold text-amber-800">
                                    {employee.sick_leave_balance} days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
