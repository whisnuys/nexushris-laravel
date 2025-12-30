import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Plus, Eye, CheckCircle, CreditCard, DollarSign } from "lucide-react";

interface Employee {
    user: { name: string };
}

interface Payroll {
    id: number;
    month: number;
    year: number;
    basic_salary: number;
    gross_salary: number;
    total_deductions: number;
    net_salary: number;
    status: string;
    payment_date: string | null;
    employee: Employee;
}

interface PaginatedPayrolls {
    data: Payroll[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    payrolls: PaginatedPayrolls;
    filters: { month?: string; year?: string; status?: string };
    canManage: boolean;
}

export default function PayrollIndex({
    auth,
    payrolls,
    filters,
    canManage,
}: Props) {
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
            <Head title="Payroll" />

            <PageHeader
                title="Payroll"
                subtitle="Manage employee payroll and salaries"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Payroll" },
                ]}
                actions={
                    canManage ? (
                        <Button
                            href="/payroll/create"
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Create Payroll
                        </Button>
                    ) : undefined
                }
            />

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
                                    Period
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Gross
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Deductions
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Net Salary
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payrolls.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={canManage ? 7 : 6}
                                        className="px-6 py-16 text-center text-slate-500"
                                    >
                                        <DollarSign className="mx-auto h-12 w-12 text-slate-300" />
                                        <p className="mt-2">
                                            No payroll records
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                payrolls.data.map((payroll) => (
                                    <tr
                                        key={payroll.id}
                                        className="hover:bg-slate-50"
                                    >
                                        {canManage && (
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                                {payroll.employee.user.name}
                                            </td>
                                        )}
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                            {getMonthName(payroll.month)}{" "}
                                            {payroll.year}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-slate-700">
                                            {formatCurrency(
                                                payroll.gross_salary
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-red-600">
                                            -
                                            {formatCurrency(
                                                payroll.total_deductions
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-emerald-600">
                                            {formatCurrency(payroll.net_salary)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge
                                                status={payroll.status}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/payroll/${payroll.id}`}
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                {canManage &&
                                                    payroll.status ===
                                                        "draft" && (
                                                        <button
                                                            onClick={() =>
                                                                router.post(
                                                                    `/payroll/${payroll.id}/process`
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                {canManage &&
                                                    payroll.status ===
                                                        "processed" && (
                                                        <button
                                                            onClick={() =>
                                                                router.post(
                                                                    `/payroll/${payroll.id}/pay`
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                                        >
                                                            <CreditCard className="h-4 w-4" />
                                                        </button>
                                                    )}
                                            </div>
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
