import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Clock,
    CalendarDays,
    DollarSign,
    BarChart3,
    Settings,
    Network,
    FileText,
    Megaphone,
    Star,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    Building2,
} from "lucide-react";
import { useTheme } from "@/Contexts/ThemeContext";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
}

interface NavCategory {
    category: string;
    items: NavItem[];
}

const navigation: NavCategory[] = [
    {
        category: "Main",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        category: "HR Management",
        items: [
            {
                name: "Employees",
                href: "/employees",
                icon: Users,
                roles: ["admin", "hr_manager"],
            },
            { name: "Attendance", href: "/attendance", icon: Clock },
            { name: "Leave", href: "/leave", icon: CalendarDays },
            { name: "Payroll", href: "/payroll", icon: DollarSign },
        ],
    },
    {
        category: "Development",
        items: [
            {
                name: "Announcements",
                href: "/announcements",
                icon: Megaphone,
                roles: ["admin", "hr_manager"],
            },
            {
                name: "Performance",
                href: "/performance-reviews",
                icon: Star,
                roles: ["admin", "hr_manager"],
            },
            {
                name: "Training",
                href: "/trainings",
                icon: GraduationCap,
                roles: ["admin", "hr_manager"],
            },
        ],
    },
    {
        category: "Analytics",
        items: [
            {
                name: "Reports",
                href: "/reports",
                icon: BarChart3,
                roles: ["admin", "hr_manager"],
            },
            {
                name: "Organization",
                href: "/organization",
                icon: Network,
                roles: ["admin", "hr_manager"],
            },
            {
                name: "Audit Trail",
                href: "/audit",
                icon: FileText,
                roles: ["admin", "hr_manager"],
            },
        ],
    },
    {
        category: "System",
        items: [
            {
                name: "Settings",
                href: "/settings",
                icon: Settings,
                roles: ["admin", "hr_manager"],
            },
        ],
    },
];

interface SidebarProps {
    user: { name: string; email: string; role: string };
}

export default function Sidebar({ user }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();
    const { darkMode } = useTheme();

    const isActive = (href: string) => url.startsWith(href);

    const filterCategory = (category: NavCategory) => {
        const filteredItems = category.items.filter(
            (item) => !item.roles || item.roles.includes(user.role)
        );
        return filteredItems.length > 0
            ? { ...category, items: filteredItems }
            : null;
    };

    const filteredNav = navigation
        .map(filterCategory)
        .filter(Boolean) as NavCategory[];

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r transition-all duration-300 ${
                collapsed ? "w-20" : "w-64"
            } ${
                darkMode
                    ? "bg-slate-900 text-white border-slate-700"
                    : "bg-slate-800 text-white border-slate-700"
            }`}
        >
            {/* Logo */}
            <div
                className={`flex h-16 items-center justify-between px-4 border-b border-slate-700`}
            >
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-blue-400" />
                        <span className="text-xl font-bold">NexusHRIS</span>
                    </div>
                )}
                {collapsed && (
                    <Building2 className="mx-auto h-8 w-8 text-blue-400" />
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {filteredNav.map((category, catIndex) => (
                    <div key={category.category} className="mb-6">
                        {!collapsed && (
                            <div className="mb-3 flex items-center gap-2 px-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {category.category}
                                </span>
                                <div className="h-px flex-1 bg-slate-700"></div>
                            </div>
                        )}
                        {collapsed && catIndex > 0 && (
                            <div className="mb-3 mx-3 h-px bg-slate-700"></div>
                        )}
                        <div className="space-y-1">
                            {category.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-slate-700 p-4">
                <div
                    className={`flex items-center gap-3 ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {user.name}
                            </p>
                            <p className="truncate text-xs text-slate-400 capitalize">
                                {user.role.replace("_", " ")}
                            </p>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                )}
            </div>
        </aside>
    );
}
