import { useTheme } from "@/Contexts/ThemeContext";
import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    const { darkMode } = useTheme();

    return (
        <div
            className={`rounded-xl border transition-colors ${
                darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-white"
            } ${className}`}
        >
            {children}
        </div>
    );
}

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export function Table({ children, className = "" }: TableProps) {
    const { darkMode } = useTheme();

    return (
        <div
            className={`overflow-hidden rounded-xl border ${
                darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-white"
            } ${className}`}
        >
            <div className="overflow-x-auto">
                <table
                    className={`min-w-full divide-y ${
                        darkMode ? "divide-slate-700" : "divide-slate-200"
                    }`}
                >
                    {children}
                </table>
            </div>
        </div>
    );
}

export function TableHead({ children }: { children: React.ReactNode }) {
    const { darkMode } = useTheme();

    return (
        <thead className={darkMode ? "bg-slate-700" : "bg-slate-50"}>
            {children}
        </thead>
    );
}

export function TableBody({ children }: { children: React.ReactNode }) {
    const { darkMode } = useTheme();

    return (
        <tbody
            className={`divide-y ${
                darkMode ? "divide-slate-700" : "divide-slate-100"
            }`}
        >
            {children}
        </tbody>
    );
}

export function TableRow({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { darkMode } = useTheme();

    return (
        <tr
            className={`transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
            } ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { darkMode } = useTheme();

    return (
        <th
            className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                darkMode ? "text-slate-300" : "text-slate-500"
            } ${className}`}
        >
            {children}
        </th>
    );
}

export function TableCell({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { darkMode } = useTheme();

    return (
        <td
            className={`px-6 py-4 ${
                darkMode ? "text-slate-300" : "text-slate-700"
            } ${className}`}
        >
            {children}
        </td>
    );
}
