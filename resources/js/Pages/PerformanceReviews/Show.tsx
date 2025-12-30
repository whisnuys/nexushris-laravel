import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import StatusBadge from "@/Components/StatusBadge";
import { PageProps } from "@/types";
import {
    ArrowLeft,
    Star,
    User,
    Calendar,
    Target,
    TrendingUp,
    MessageSquare,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    user: User;
    department: string;
    job_title: string;
}

interface Review {
    id: number;
    employee: Employee;
    reviewer: User;
    review_period: string;
    rating: number | null;
    strengths: string | null;
    improvements: string | null;
    goals: string | null;
    comments: string | null;
    status: string;
    submitted_at: string | null;
    created_at: string;
}

interface Props extends PageProps {
    review: Review;
}

export default function PerformanceReviewShow({ review }: Props) {
    const getRatingStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${
                            star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                        }`}
                    />
                ))}
                <span className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {rating}/5
                </span>
            </div>
        );
    };

    const getRatingLabel = (rating: number | null) => {
        if (!rating) return "Not rated";
        const labels = [
            "",
            "Needs Improvement",
            "Below Expectations",
            "Meets Expectations",
            "Exceeds Expectations",
            "Outstanding",
        ];
        return labels[rating];
    };

    return (
        <AppLayout>
            <Head title={`Review - ${review.employee.user.name}`} />

            <PageHeader
                title={`Performance Review`}
                subtitle={`${review.review_period} review for ${review.employee.user.name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    {
                        label: "Performance Reviews",
                        href: "/performance-reviews",
                    },
                    { label: review.employee.user.name },
                ]}
                actions={
                    <Link
                        href="/performance-reviews"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Reviews
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Employee Info & Rating */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Employee Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                {review.employee.user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {review.employee.user.name}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {review.employee.job_title}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {review.employee.department}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Status
                                </span>
                                <StatusBadge status={review.status} />
                            </div>
                        </div>
                    </div>

                    {/* Rating Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                            Overall Rating
                        </h4>
                        {getRatingStars(review.rating)}
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {getRatingLabel(review.rating)}
                        </p>
                    </div>

                    {/* Review Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                            Review Details
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Period
                                    </p>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {review.review_period}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Reviewed by
                                    </p>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {review.reviewer.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Created
                                    </p>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {new Date(
                                            review.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Strengths */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/40">
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                Strengths
                            </h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {review.strengths || "No strengths documented."}
                        </p>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/40">
                                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                Areas for Improvement
                            </h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {review.improvements ||
                                "No improvements documented."}
                        </p>
                    </div>

                    {/* Goals */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/40">
                                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                Goals & Objectives
                            </h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {review.goals || "No goals documented."}
                        </p>
                    </div>

                    {/* Comments */}
                    {review.comments && (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/40">
                                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                    Additional Comments
                                </h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {review.comments}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
