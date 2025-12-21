import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";

interface Author {
    id: number;
    name: string;
}

interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: string;
    status: string;
    published_at: string | null;
    expires_at: string | null;
    author: Author;
}

interface PaginatedAnnouncements {
    data: Announcement[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    announcements: PaginatedAnnouncements;
}

export default function AnnouncementsIndex({ auth, announcements }: Props) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-red-100 text-red-700";
            case "high":
                return "bg-orange-100 text-orange-700";
            case "normal":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <AppLayout>
            <Head title="Announcements" />

            <PageHeader
                title="Announcements"
                subtitle="Company-wide announcements and updates"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Announcements" },
                ]}
                actions={
                    <Button
                        href="/announcements/create"
                        icon={<Plus className="h-4 w-4" />}
                    >
                        New Announcement
                    </Button>
                }
            />

            <div className="space-y-4">
                {announcements.data.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                        <Megaphone className="mx-auto h-12 w-12 text-slate-300" />
                        <p className="mt-2 text-slate-500">
                            No announcements yet
                        </p>
                    </div>
                ) : (
                    announcements.data.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-slate-200 bg-white p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {item.title}
                                        </h3>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getPriorityColor(
                                                item.priority
                                            )}`}
                                        >
                                            {item.priority}
                                        </span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <p className="mt-2 text-slate-600 line-clamp-2">
                                        {item.content}
                                    </p>
                                    <p className="mt-3 text-sm text-slate-500">
                                        By {item.author.name} •{" "}
                                        {item.published_at
                                            ? new Date(
                                                  item.published_at
                                              ).toLocaleDateString()
                                            : "Draft"}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Link
                                        href={`/announcements/${item.id}/edit`}
                                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            router.delete(
                                                `/announcements/${item.id}`
                                            )
                                        }
                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
