import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { PageProps } from "@/types";
import { Save } from "lucide-react";

interface Employee {
    id: number;
    user: { name: string };
}

interface Props extends PageProps {
    employees: Employee[];
}

export default function PerformanceReviewsCreate({ auth, employees }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: "",
        review_period: "",
        rating: "",
        strengths: "",
        improvements: "",
        goals: "",
        comments: "",
        status: "draft",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/performance-reviews");
    };

    return (
        <AppLayout>
            <Head title="New Performance Review" />

            <PageHeader
                title="New Performance Review"
                subtitle="Create an employee performance evaluation"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    {
                        label: "Performance Reviews",
                        href: "/performance-reviews",
                    },
                    { label: "New" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Review Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Employee *
                            </label>
                            <select
                                value={data.employee_id}
                                onChange={(e) =>
                                    setData("employee_id", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Review Period *
                            </label>
                            <input
                                type="text"
                                value={data.review_period}
                                onChange={(e) =>
                                    setData("review_period", e.target.value)
                                }
                                placeholder="e.g., Q4 2025, 2025 Annual"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Rating (1-5)
                            </label>
                            <select
                                value={data.rating}
                                onChange={(e) =>
                                    setData("rating", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select rating</option>
                                <option value="1">1 - Needs Improvement</option>
                                <option value="2">
                                    2 - Below Expectations
                                </option>
                                <option value="3">
                                    3 - Meets Expectations
                                </option>
                                <option value="4">
                                    4 - Exceeds Expectations
                                </option>
                                <option value="5">5 - Outstanding</option>
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
                                <option value="submitted">Submit Now</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Feedback
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Strengths
                            </label>
                            <textarea
                                value={data.strengths}
                                onChange={(e) =>
                                    setData("strengths", e.target.value)
                                }
                                rows={3}
                                placeholder="What does this employee do well?"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Areas for Improvement
                            </label>
                            <textarea
                                value={data.improvements}
                                onChange={(e) =>
                                    setData("improvements", e.target.value)
                                }
                                rows={3}
                                placeholder="What areas need development?"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Goals for Next Period
                            </label>
                            <textarea
                                value={data.goals}
                                onChange={(e) =>
                                    setData("goals", e.target.value)
                                }
                                rows={3}
                                placeholder="What should they focus on?"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Additional Comments
                            </label>
                            <textarea
                                value={data.comments}
                                onChange={(e) =>
                                    setData("comments", e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button href="/performance-reviews" variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        icon={<Save className="h-4 w-4" />}
                    >
                        Create Review
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
