import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save } from "lucide-react";

interface Employee {
    id: number;
    employee_code: string;
    salary_basic: number;
    salary_allowances: number;
    user: { name: string };
}

interface Props extends PageProps {
    employees: Employee[];
    currentMonth: number;
    currentYear: number;
}

export default function PayrollCreate({
    auth,
    employees,
    currentMonth,
    currentYear,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: "",
        month: currentMonth.toString(),
        year: currentYear.toString(),
        overtime_hours: "0",
        bonus: "0",
        other_deductions: "0",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/payroll");
    };

    const selectedEmployee = employees.find(
        (e) => e.id.toString() === data.employee_id
    );

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <AppLayout>
            <Head title="Create Payroll" />

            <PageHeader
                title="Create Payroll"
                subtitle="Generate payroll for an employee"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Payroll", href: "/payroll" },
                    { label: "Create" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Employee & Period */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Payroll Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Employee *
                            </label>
                            <select
                                value={data.employee_id}
                                onChange={(e) =>
                                    setData("employee_id", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.user.name} ({emp.employee_code})
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Month *
                            </label>
                            <select
                                value={data.month}
                                onChange={(e) =>
                                    setData("month", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Year *
                            </label>
                            <input
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Salary Preview */}
                {selectedEmployee && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-blue-900">
                            Salary Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <p className="text-sm text-blue-700">
                                    Basic Salary
                                </p>
                                <p className="text-xl font-bold text-blue-900">
                                    {formatCurrency(
                                        selectedEmployee.salary_basic
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700">
                                    Allowances
                                </p>
                                <p className="text-xl font-bold text-blue-900">
                                    {formatCurrency(
                                        selectedEmployee.salary_allowances
                                    )}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-blue-700">
                                    Total Monthly
                                </p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatCurrency(
                                        selectedEmployee.salary_basic +
                                            selectedEmployee.salary_allowances
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Earnings/Deductions */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Adjustments
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Overtime Hours
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.overtime_hours}
                                onChange={(e) =>
                                    setData("overtime_hours", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Rate: Rp 50,000 per hour
                            </p>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Bonus
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.bonus}
                                onChange={(e) =>
                                    setData("bonus", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Other Deductions
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.other_deductions}
                                onChange={(e) =>
                                    setData("other_deductions", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button href="/payroll" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Create Payroll
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
