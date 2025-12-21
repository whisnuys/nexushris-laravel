import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { PageProps } from "@/types";
import { Clock, User } from "lucide-react";

interface AuditUser {
    id: number;
    name: string;
}

interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    table_name: string;
    record_id: number;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
    user: AuditUser | null;
}

interface PaginatedLogs {
    data: AuditLog[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    total: number;
}

interface Props extends PageProps {
    logs: PaginatedLogs;
    actions: string[];
    tableNames: string[];
    filters: {
        action?: string;
        table_name?: string;
    };
}

export default function AuditIndex({
    auth,
    logs,
    actions,
    tableNames,
    filters,
}: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get(
            "/audit",
            { ...filters, [key]: value || undefined },
            { preserveState: true }
        );
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case "create":
                return "bg-emerald-100 text-emerald-700";
            case "update":
                return "bg-blue-100 text-blue-700";
            case "delete":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AppLayout>
            <Head title="Audit Trail" />

            <PageHeader
                title="Audit Trail"
                subtitle={`${logs.total} records of system activity`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Audit Trail" },
                ]}
            />

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">
                        Action:
                    </label>
                    <select
                        value={filters.action || ""}
                        onChange={(e) => handleFilter("action", e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">All Actions</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">
                        Table:
                    </label>
                    <select
                        value={filters.table_name || ""}
                        onChange={(e) =>
                            handleFilter("table_name", e.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">All Tables</option>
                        {tableNames.map((table) => (
                            <option key={table} value={table}>
                                {table}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Table
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-16 text-center text-slate-500"
                                    >
                                        <Clock className="mx-auto h-12 w-12 text-slate-300" />
                                        <p className="mt-2">
                                            No audit logs found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                </div>
                                                <span className="text-sm text-slate-900">
                                                    {log.user?.name || "System"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getActionColor(
                                                    log.action
                                                )}`}
                                            >
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {log.table_name} #{log.record_id}
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-500">
                                            {log.new_values
                                                ? JSON.stringify(
                                                      log.new_values
                                                  ).slice(0, 50) + "..."
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                        <p className="text-sm text-slate-500">
                            Page {logs.current_page} of {logs.last_page}
                        </p>
                        <div className="flex gap-1">
                            {logs.links.map((link, index) => (
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
