import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Plus, Eye, Users } from "lucide-react";

interface Training {
    id: number;
    title: string;
    description: string | null;
    provider: string | null;
    type: string;
    start_date: string | null;
    end_date: string | null;
    duration_hours: number | null;
    status: string;
    employees_count: number;
}

interface PaginatedTrainings {
    data: Training[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    trainings: PaginatedTrainings;
    canManage: boolean;
}

export default function TrainingsIndex({ auth, trainings, canManage }: Props) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case "online":
                return "bg-blue-100 text-blue-700";
            case "in-person":
                return "bg-emerald-100 text-emerald-700";
            default:
                return "bg-purple-100 text-purple-700";
        }
    };

    return (
        <AppLayout>
            <Head title="Trainings" />

            <PageHeader
                title="Trainings"
                subtitle="Training programs and certifications"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Trainings" },
                ]}
                actions={
                    canManage ? (
                        <Button
                            href="/trainings/create"
                            icon={<Plus className="h-4 w-4" />}
                        >
                            New Training
                        </Button>
                    ) : undefined
                }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trainings.data.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-slate-200 bg-white py-16 text-center">
                        <p className="text-slate-500">No trainings available</p>
                    </div>
                ) : (
                    trainings.data.map((training) => (
                        <Link
                            key={training.id}
                            href={`/trainings/${training.id}`}
                            className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                    {training.title}
                                </h3>
                                <StatusBadge status={training.status} />
                            </div>
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                {training.description || "No description"}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getTypeColor(
                                        training.type
                                    )}`}
                                >
                                    {training.type}
                                </span>
                                {training.duration_hours && (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                        {training.duration_hours}h
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <Users className="h-4 w-4" />
                                {training.employees_count} enrolled
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
