import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save, Building2, CalendarDays, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

interface Settings {
    company: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    leave: {
        annual_days: number;
        sick_days: number;
        carry_over_limit: number;
    };
    payroll: {
        tax_rate: number;
        social_security_rate: number;
        health_insurance: number;
        overtime_rate: number;
    };
    attendance: {
        work_start: string;
        work_end: string;
        late_threshold: number;
    };
}

interface Props extends PageProps {
    settings: Settings;
}

type TabKey = "company" | "leave" | "payroll" | "attendance";

export default function SettingsIndex({ auth, settings }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>("company");

    const { data, setData, post, processing } = useForm({
        ...settings.company,
        ...settings.leave,
        ...settings.payroll,
        ...settings.attendance,
    });

    const tabs = [
        { key: "company" as TabKey, label: "Company", icon: Building2 },
        { key: "leave" as TabKey, label: "Leave Policies", icon: CalendarDays },
        { key: "payroll" as TabKey, label: "Payroll", icon: DollarSign },
        { key: "attendance" as TabKey, label: "Attendance", icon: Clock },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/settings");
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <PageHeader
                title="Settings"
                subtitle="Configure your organization preferences"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Settings" },
                ]}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Tabs */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                                    activeTab === tab.key
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit}>
                        {/* Company Settings */}
                        {activeTab === "company" && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Company Information
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            HR Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Address
                                        </label>
                                        <textarea
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leave Policies */}
                        {activeTab === "leave" && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Leave Policies
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Annual Leave (days/year)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.annual_days}
                                            onChange={(e) =>
                                                setData(
                                                    "annual_days",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Sick Leave (days/year)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.sick_days}
                                            onChange={(e) =>
                                                setData(
                                                    "sick_days",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Carry Over Limit (days)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.carry_over_limit}
                                            onChange={(e) =>
                                                setData(
                                                    "carry_over_limit",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payroll Settings */}
                        {activeTab === "payroll" && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Payroll Settings
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Tax Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.tax_rate}
                                            onChange={(e) =>
                                                setData(
                                                    "tax_rate",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Social Security Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.social_security_rate}
                                            onChange={(e) =>
                                                setData(
                                                    "social_security_rate",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Health Insurance (IDR/month)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.health_insurance}
                                            onChange={(e) =>
                                                setData(
                                                    "health_insurance",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Overtime Rate (IDR/hour)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.overtime_rate}
                                            onChange={(e) =>
                                                setData(
                                                    "overtime_rate",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attendance Settings */}
                        {activeTab === "attendance" && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Attendance Settings
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Work Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={data.work_start}
                                            onChange={(e) =>
                                                setData(
                                                    "work_start",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Work End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={data.work_end}
                                            onChange={(e) =>
                                                setData(
                                                    "work_end",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Late Threshold (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.late_threshold}
                                            onChange={(e) =>
                                                setData(
                                                    "late_threshold",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <Button
                                type="submit"
                                loading={processing}
                                icon={<Save className="h-4 w-4" />}
                            >
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
