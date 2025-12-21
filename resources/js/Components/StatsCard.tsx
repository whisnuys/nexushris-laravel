import { Link } from "@inertiajs/react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/Contexts/ThemeContext";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    href?: string;
    color?: "blue" | "green" | "yellow" | "purple" | "red";
}

const colorClasses = {
    blue: {
        light: "bg-blue-50 text-blue-600",
        dark: "bg-blue-900/40 text-blue-300",
    },
    green: {
        light: "bg-emerald-50 text-emerald-600",
        dark: "bg-emerald-900/40 text-emerald-300",
    },
    yellow: {
        light: "bg-amber-50 text-amber-600",
        dark: "bg-amber-900/40 text-amber-300",
    },
    purple: {
        light: "bg-purple-50 text-purple-600",
        dark: "bg-purple-900/40 text-purple-300",
    },
    red: {
        light: "bg-red-50 text-red-600",
        dark: "bg-red-900/40 text-red-300",
    },
};

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    href,
    color = "blue",
}: StatsCardProps) {
    const { darkMode } = useTheme();
    const colorClass = darkMode
        ? colorClasses[color].dark
        : colorClasses[color].light;

    const content = (
        <div
            className={`overflow-hidden rounded-xl border p-6 transition-shadow hover:shadow-md ${
                darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-white"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p
                        className={`text-sm font-medium ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                    >
                        {title}
                    </p>
                    <p
                        className={`mt-2 text-3xl font-bold ${
                            darkMode ? "text-white" : "text-slate-900"
                        }`}
                    >
                        {value}
                    </p>
                    {trend && (
                        <div className="mt-2 flex items-center gap-1">
                            {trend.isPositive ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-medium ${
                                    trend.isPositive
                                        ? "text-emerald-500"
                                        : "text-red-500"
                                }`}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}%
                            </span>
                            <span
                                className={`text-sm ${
                                    darkMode
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                }`}
                            >
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div className={`rounded-lg p-3 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
