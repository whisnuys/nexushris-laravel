import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save } from "lucide-react";

export default function TrainingsCreate({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        provider: "",
        type: "online",
        start_date: "",
        end_date: "",
        duration_hours: "",
        status: "upcoming",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/trainings");
    };

    return (
        <AppLayout>
            <Head title="New Training" />

            <PageHeader
                title="New Training"
                subtitle="Create a training program"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Trainings", href: "/trainings" },
                    { label: "New" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Training Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Provider
                            </label>
                            <input
                                type="text"
                                value={data.provider}
                                onChange={(e) =>
                                    setData("provider", e.target.value)
                                }
                                placeholder="e.g., Coursera, LinkedIn Learning"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Type
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="online">Online</option>
                                <option value="in-person">In-Person</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Duration (hours)
                            </label>
                            <input
                                type="number"
                                value={data.duration_hours}
                                onChange={(e) =>
                                    setData("duration_hours", e.target.value)
                                }
                                min="1"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button href="/trainings" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Create Training
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
