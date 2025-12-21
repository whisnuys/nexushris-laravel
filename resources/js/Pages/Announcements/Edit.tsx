import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: string;
    status: string;
    expires_at: string | null;
}

interface Props extends PageProps {
    announcement: Announcement;
}

export default function AnnouncementsEdit({ auth, announcement }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        status: announcement.status,
        expires_at: announcement.expires_at?.split("T")[0] || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/announcements/${announcement.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Announcement" />

            <PageHeader
                title="Edit Announcement"
                subtitle="Update announcement details"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Announcements", href: "/announcements" },
                    { label: "Edit" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
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
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Content *
                            </label>
                            <textarea
                                value={data.content}
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                rows={6}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.content}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Priority
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData("priority", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
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
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Expires At
                                </label>
                                <input
                                    type="date"
                                    value={data.expires_at}
                                    onChange={(e) =>
                                        setData("expires_at", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button href="/announcements" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
