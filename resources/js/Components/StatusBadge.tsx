interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
    // Employee statuses
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    on_leave: "bg-amber-50 text-amber-700 ring-amber-600/20",
    resigned: "bg-slate-50 text-slate-700 ring-slate-600/20",
    terminated: "bg-red-50 text-red-700 ring-red-600/20",

    // Attendance statuses
    present: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    late: "bg-amber-50 text-amber-700 ring-amber-600/20",
    absent: "bg-red-50 text-red-700 ring-red-600/20",

    // Leave statuses
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/20",
    cancelled: "bg-slate-50 text-slate-700 ring-slate-600/20",

    // Payroll statuses
    draft: "bg-slate-50 text-slate-700 ring-slate-600/20",
    processed: "bg-blue-50 text-blue-700 ring-blue-600/20",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
    const style =
        statusStyles[status] || "bg-slate-50 text-slate-700 ring-slate-600/20";
    const sizeClass =
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset capitalize ${style} ${sizeClass}`}
        >
            {status.replace("_", " ")}
        </span>
    );
}
