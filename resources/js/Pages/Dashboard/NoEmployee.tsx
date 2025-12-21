import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { AlertCircle, Mail } from "lucide-react";
import Button from "@/Components/Button";

export default function NoEmployee({ auth }: PageProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                        <AlertCircle className="h-10 w-10 text-amber-600" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-900">
                        No Employee Profile
                    </h2>
                    <p className="mb-6 text-slate-500">
                        Your account doesn't have an employee profile yet.
                        Please contact your HR administrator to set up your
                        profile.
                    </p>
                    <Button
                        href="mailto:hr@company.com"
                        variant="secondary"
                        icon={<Mail className="h-4 w-4" />}
                    >
                        Contact HR
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
