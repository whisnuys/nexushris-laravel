import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Plus, Eye, Star } from "lucide-react";

interface Review {
    id: number;
    review_period: string;
    rating: number | null;
    status: string;
    submitted_at: string | null;
    employee: { id: number; user: { name: string } };
    reviewer: { name: string };
}

interface PaginatedReviews {
    data: Review[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    reviews: PaginatedReviews;
    canCreate: boolean;
}

export default function PerformanceReviewsIndex({
    auth,
    reviews,
    canCreate,
}: Props) {
    const renderStars = (rating: number | null) => {
        if (!rating) return <span className="text-slate-400">Not rated</span>;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Performance Reviews" />

            <PageHeader
                title="Performance Reviews"
                subtitle="Employee performance evaluations"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Performance Reviews" },
                ]}
                actions={
                    canCreate ? (
                        <Button
                            href="/performance-reviews/create"
                            icon={<Plus className="h-4 w-4" />}
                        >
                            New Review
                        </Button>
                    ) : undefined
                }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                Period
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                Rating
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                Reviewer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reviews.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-16 text-center text-slate-500"
                                >
                                    No reviews found
                                </td>
                            </tr>
                        ) : (
                            reviews.data.map((review) => (
                                <tr
                                    key={review.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {review.employee.user.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {review.review_period}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStars(review.rating)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {review.reviewer.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={review.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/performance-reviews/${review.id}`}
                                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
