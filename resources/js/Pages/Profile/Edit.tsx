import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout>
            <Head title="Profile" />

            <PageHeader
                title="Profile Settings"
                subtitle="Manage your account information and preferences"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Profile" },
                ]}
            />

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                {/* Update Password */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Delete Account */}
                <div className="rounded-xl border border-red-100 bg-white p-6">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AppLayout>
    );
}
