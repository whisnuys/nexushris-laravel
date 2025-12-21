import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface Toast {
    id: number;
    type: "success" | "error" | "warning";
    message: string;
}

export default function ToastNotifications() {
    const { flash } = usePage().props as any;
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        if (flash?.success) {
            addToast("success", flash.success);
        }
        if (flash?.error) {
            addToast("error", flash.error);
        }
        if (flash?.warning) {
            addToast("warning", flash.warning);
        }
    }, [flash]);

    const addToast = (type: Toast["type"], message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case "error":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "warning":
                return <AlertCircle className="h-5 w-5 text-amber-500" />;
        }
    };

    const getBgColor = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "bg-emerald-50 border-emerald-200";
            case "error":
                return "bg-red-50 border-red-200";
            case "warning":
                return "bg-amber-50 border-amber-200";
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${getBgColor(
                        toast.type
                    )}`}
                >
                    {getIcon(toast.type)}
                    <p className="text-sm font-medium text-slate-700">
                        {toast.message}
                    </p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
