"use client"

import Link from "next/link"

import {
    Heart,
    MessageSquareMore,
    LifeBuoy,
    ScrollText,
    ShieldCheck,
    Newspaper,
} from "lucide-react"


const footerLinks = [
    {
        label: "Feedback",
        href: "/settings/feedback",
        icon: MessageSquareMore,
    },
    {
        label: "Support",
        href: "/settings/support",
        icon: LifeBuoy,
    },
    {
        label: "Changelog",
        href: "/changelog",
        icon: Newspaper,
    },
    {
        label: "Terms",
        href: "/terms",
        icon: ScrollText,
    },
    {
        label: "Privacy",
        href: "/privacy",
        icon: ShieldCheck,
    },
]


export default function AppFooter() {
    return (
        <footer
            className="
                mt-10
                border-t
                border-[#E5E7EB]
                px-4
                py-6
                text-[#6B7280]
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <p className="text-sm font-semibold text-[#18181B]">
                        DevManiac
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-[#9CA3AF]">
                        Built for people who actually ship
                        <Heart
                            size={12}
                            className="text-orange-500"
                        />
                    </p>
                </div>

                <nav
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {footerLinks.map((link) => {
                        const Icon = link.icon

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-md
                                    border
                                    border-[#E5E7EB]
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-[#6B7280]
                                    transition
                                    hover:border-[#FED7AA]
                                    hover:bg-[#FFF4ED]
                                    hover:text-[#D94F0B]
                                "
                            >
                                <Icon
                                    size={13}
                                    className="
                                        text-[#9CA3AF]
                                        transition
                                        group-hover:text-[#D94F0B]
                                    "
                                />

                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </footer>
    )
}
