import { createContext, useContext, ReactNode } from "react";
import { usePage, router } from "@inertiajs/react";

type Language = "en" | "id";

interface LanguageContextType {
    locale: Language;
    setLocale: (lang: Language) => void;
    t: (key: string) => string;
    formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

// Currency conversion rate (1 USD = 16,000 IDR)
const USD_TO_IDR_RATE = 16000;

export function LanguageProvider({ children }: { children: ReactNode }) {
    const pageProps = usePage().props as any;
    const locale = (pageProps.locale || "id") as Language;
    const translations = (pageProps.translations || {}) as Record<
        string,
        string
    >;

    const setLocale = (lang: Language) => {
        router.post(
            `/locale/${lang}`,
            {},
            {
                preserveScroll: false,
                onSuccess: () => {
                    // Force a full page reload to get fresh translations
                    window.location.reload();
                },
            }
        );
    };

    const t = (key: string): string => {
        return translations?.[key] || key;
    };

    // Currency conversion: data is stored in IDR
    // When language is EN, convert to USD
    // When language is ID, display as IDR
    const formatCurrency = (amountInIDR: number): string => {
        if (locale === "en") {
            const amountInUSD = amountInIDR / USD_TO_IDR_RATE;
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amountInUSD);
        } else {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amountInIDR);
        }
    };

    return (
        <LanguageContext.Provider
            value={{ locale: locale || "id", setLocale, t, formatCurrency }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        // Fallback for when used outside LanguageProvider
        return {
            locale: "id" as Language,
            setLocale: () => {},
            t: (key: string) => key,
            formatCurrency: (amount: number) =>
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(amount),
        };
    }
    return context;
}
