import { Link, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect, useContext } from "react";
import { Bell, X } from "lucide-react";
import { createContext } from "react";

interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: string;
    created_at: string;
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Check if dark mode via DOM class (safer than context)
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        setDarkMode(document.documentElement.classList.contains("dark"));
        const observer = new MutationObserver(() => {
            setDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    // Get notifications from page props
    const { notifications = [] } = usePage().props as {
        notifications?: Announcement[];
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-red-500";
            case "high":
                return "bg-orange-500";
            default:
                return "bg-blue-500";
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative rounded-lg p-2 ${
                    darkMode
                        ? "text-slate-400 hover:bg-slate-700"
                        : "text-slate-500 hover:bg-slate-100"
                }`}
            >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl ${
                        darkMode
                            ? "border-slate-700 bg-slate-800"
                            : "border-slate-200 bg-white"
                    }`}
                >
                    <div
                        className={`flex items-center justify-between border-b px-4 py-3 ${
                            darkMode ? "border-slate-700" : "border-slate-200"
                        }`}
                    >
                        <h3
                            className={`font-semibold ${
                                darkMode ? "text-white" : "text-slate-900"
                            }`}
                        >
                            Notifications
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`rounded p-1 ${
                                darkMode
                                    ? "hover:bg-slate-700"
                                    : "hover:bg-slate-100"
                            }`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div
                                className={`p-6 text-center ${
                                    darkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}
                            >
                                <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/announcements/${item.id}/edit`}
                                    onClick={() => setIsOpen(false)}
                                    className={`block border-b px-4 py-3 transition-colors ${
                                        darkMode
                                            ? "border-slate-700 hover:bg-slate-700"
                                            : "border-slate-100 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${getPriorityColor(
                                                item.priority
                                            )}`}
                                        ></div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate font-medium ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {item.title}
                                            </p>
                                            <p
                                                className={`line-clamp-2 text-sm ${
                                                    darkMode
                                                        ? "text-slate-400"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {item.content}
                                            </p>
                                            <p
                                                className={`mt-1 text-xs ${
                                                    darkMode
                                                        ? "text-slate-500"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {formatTimeAgo(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div
                            className={`border-t px-4 py-3 ${
                                darkMode
                                    ? "border-slate-700"
                                    : "border-slate-200"
                            }`}
                        >
                            <Link
                                href="/announcements"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm font-medium text-blue-500 hover:text-blue-600"
                            >
                                View all announcements
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
