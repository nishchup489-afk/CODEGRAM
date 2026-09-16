"use client";

import Link from "next/link";

import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Megaphone,
    ShieldAlert,
    Wrench,
    X,
} from "lucide-react";

type AppNotice = {
    id: string;
    title: string;
    message: string;
    notice_type: string;
    cta_label: string | null;
    cta_href: string | null;
    show_once: boolean;
};

type Props = {
    notice: AppNotice;
    onClose: () => void;
};

function getNoticeMeta(type: string) {
    if (type === "warning") {
        return {
            icon: AlertTriangle,
            label: "Important notice",
            color: "text-yellow-700",
            box: "border-yellow-500/30 bg-yellow-50",
        };
    }

    if (type === "danger") {
        return {
            icon: ShieldAlert,
            label: "Critical notice",
            color: "text-red-600",
            box: "border-red-500/30 bg-red-50",
        };
    }

    if (type === "maintenance") {
        return {
            icon: Wrench,
            label: "Maintenance",
            color: "text-orange-600",
            box: "border-orange-500/30 bg-orange-50",
        };
    }

    if (type === "success") {
        return {
            icon: CheckCircle2,
            label: "Resolved",
            color: "text-emerald-600",
            box: "border-emerald-500/30 bg-emerald-50",
        };
    }

    if (type === "update") {
        return {
            icon: Megaphone,
            label: "Product update",
            color: "text-orange-600",
            box: "border-orange-500/30 bg-orange-50",
        };
    }

    return {
        icon: Info,
        label: "Notice",
        color: "text-sky-600",
        box: "border-sky-500/30 bg-sky-50",
    };
}

export default function AppNoticePopup({
    notice,
    onClose,
}: Props) {
    const meta = getNoticeMeta(notice.notice_type);

    const Icon = meta.icon;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-[#18181B]/45 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_80px_rgba(17,24,39,0.16)] sm:p-8">
                <button
                    type="button"
                    aria-label="Close notice"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-orange-200 hover:bg-[#FFF7ED] hover:text-[#E8560A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                >
                    <X size={18} aria-hidden="true" />
                </button>

                <div className="relative">
                    <div
                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${meta.box} ${meta.color}`}
                    >
                        <Icon size={26} />
                    </div>

                    <p
                        className={`text-xs font-bold uppercase tracking-[0.22em] ${meta.color}`}
                    >
                        {meta.label}
                    </p>

                    <h2 className="mt-3 pr-10 text-3xl font-semibold tracking-[-0.04em] text-[#18181B]">
                        {notice.title}
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B7280]">
                        {notice.message}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {notice.cta_href && notice.cta_label && (
                            <Link
                                href={notice.cta_href}
                                onClick={onClose}
                                className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#E8560A] text-sm font-semibold text-white transition hover:bg-[#CF4B08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                            >
                                {notice.cta_label}
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] text-sm font-semibold text-[#374151] transition hover:border-orange-200 hover:bg-[#FFF7ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
