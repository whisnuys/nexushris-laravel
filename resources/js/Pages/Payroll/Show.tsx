import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import { PageProps } from "@/types";
import { ArrowLeft, Download, Printer } from "lucide-react";

interface Employee {
    employee_code: string;
    job_title: string;
    department: string;
    user: { name: string; email: string };
}

interface Payroll {
    id: number;
    month: number;
    year: number;
    basic_salary: number;
    allowances: number;
    overtime_pay: number;
    bonus: number;
    gross_salary: number;
    tax: number;
    social_security: number;
    health_insurance: number;
    other_deductions: number;
    total_deductions: number;
    net_salary: number;
    status: string;
    payment_date: string | null;
    employee: Employee;
}

interface Props extends PageProps {
    payroll: Payroll;
}

export default function PayrollShow({ auth, payroll }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    const getMonthName = (month: number) =>
        new Date(2000, month - 1).toLocaleString("en-US", { month: "long" });

    return (
        <AppLayout>
            <Head title="Payslip" />

            <PageHeader
                title="Payslip"
                subtitle={`${getMonthName(payroll.month)} ${payroll.year}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Payroll", href: "/payroll" },
                    { label: "Payslip" },
                ]}
            />

            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                PAYSLIP
                            </h3>
                            <p className="text-sm text-slate-500">
                                {getMonthName(payroll.month)} {payroll.year}
                            </p>
                        </div>
                        <StatusBadge status={payroll.status} size="md" />
                    </div>

                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 p-6">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Employee Name
                            </p>
                            <p className="font-medium text-slate-900">
                                {payroll.employee.user.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Employee ID
                            </p>
                            <p className="font-medium text-slate-900">
                                {payroll.employee.employee_code}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Department
                            </p>
                            <p className="font-medium text-slate-900">
                                {payroll.employee.department}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Position
                            </p>
                            <p className="font-medium text-slate-900">
                                {payroll.employee.job_title}
                            </p>
                        </div>
                    </div>

                    {/* Earnings */}
                    <div className="border-b border-slate-100 p-6">
                        <h4 className="mb-4 font-semibold text-slate-900">
                            Earnings
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-600">
                                    Basic Salary
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(payroll.basic_salary)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">
                                    Allowances
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(payroll.allowances)}
                                </span>
                            </div>
                            {payroll.overtime_pay > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Overtime
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(payroll.overtime_pay)}
                                    </span>
                                </div>
                            )}
                            {payroll.bonus > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Bonus
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(payroll.bonus)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-slate-100 pt-3">
                                <span className="font-semibold text-slate-900">
                                    Gross Salary
                                </span>
                                <span className="font-bold text-slate-900">
                                    {formatCurrency(payroll.gross_salary)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="border-b border-slate-100 p-6">
                        <h4 className="mb-4 font-semibold text-slate-900">
                            Deductions
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Tax (5%)</span>
                                <span className="font-medium text-red-600">
                                    -{formatCurrency(payroll.tax)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">
                                    Social Security (2%)
                                </span>
                                <span className="font-medium text-red-600">
                                    -{formatCurrency(payroll.social_security)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">
                                    Health Insurance
                                </span>
                                <span className="font-medium text-red-600">
                                    -{formatCurrency(payroll.health_insurance)}
                                </span>
                            </div>
                            {payroll.other_deductions > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Other
                                    </span>
                                    <span className="font-medium text-red-600">
                                        -
                                        {formatCurrency(
                                            payroll.other_deductions
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-slate-100 pt-3">
                                <span className="font-semibold text-slate-900">
                                    Total Deductions
                                </span>
                                <span className="font-bold text-red-600">
                                    -{formatCurrency(payroll.total_deductions)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Net Salary */}
                    <div className="bg-emerald-50 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-900">
                                Net Salary
                            </span>
                            <span className="text-3xl font-bold text-emerald-600">
                                {formatCurrency(payroll.net_salary)}
                            </span>
                        </div>
                        {payroll.payment_date && (
                            <p className="mt-2 text-sm text-slate-500">
                                Paid on: {payroll.payment_date}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
