import { PropsWithChildren } from "react";
import Sidebar from "@/Components/Sidebar";
import ToastNotifications from "@/Components/ToastNotifications";
import NotificationDropdown from "@/Components/NotificationDropdown";
import { usePage, Link } from "@inertiajs/react";
import { Search, Sun, Moon } from "lucide-react";
import { ThemeProvider, useTheme } from "@/Contexts/ThemeContext";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

function AppLayoutContent({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div
            className={`min-h-screen transition-colors ${
                darkMode ? "bg-slate-900" : "bg-slate-50"
            }`}
        >
            <Sidebar user={auth.user} />

            <div
                className={`pl-64 transition-all duration-300 ${
                    darkMode
                        ? "border-l border-slate-700"
                        : "border-l border-slate-200"
                }`}
            >
                <header
                    className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 ${
                        darkMode
                            ? "border-slate-700 bg-slate-800"
                            : "border-slate-200 bg-white"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {title && (
                            <h1
                                className={`text-xl font-semibold ${
                                    darkMode ? "text-white" : "text-slate-900"
                                }`}
                            >
                                {title}
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`w-64 rounded-lg border py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    darkMode
                                        ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                                        : "border-slate-200 bg-slate-50 text-slate-900"
                                }`}
                            />
                        </div>

                        <NotificationDropdown />

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`rounded-lg p-2 ${
                                darkMode
                                    ? "text-slate-400 hover:bg-slate-700"
                                    : "text-slate-500 hover:bg-slate-100"
                            }`}
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        <Link
                            href="/profile"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>

            <ToastNotifications />
        </div>
    );
}

export default function AppLayout({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    return (
        <ThemeProvider>
            <AppLayoutContent title={title}>{children}</AppLayoutContent>
        </ThemeProvider>
    );
}
