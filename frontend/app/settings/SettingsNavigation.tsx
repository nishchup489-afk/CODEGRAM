"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Github,
    Info,
    LifeBuoy,
    Lock,
    MessageSquareMore,
    Shield,
    User,
} from "lucide-react"

import useCurrentUser from "@/app/_lib/currentUser"

const settingsNavigation = [
    { label: "Profile", href: "/settings/profile", icon: User },
    { label: "Account", href: "/settings/account", icon: Shield },
    { label: "Privacy", href: "/settings/privacy", icon: Lock },
    { label: "GitHub", href: "/settings/github", icon: Github },
    { label: "Support", href: "/settings/support", icon: LifeBuoy },
    { label: "Feedback", href: "/settings/feedback", icon: MessageSquareMore },
    { label: "About", href: "/settings/about", icon: Info },
]

export default function SettingsNavigation() {
    const pathname = usePathname()
    const { currentUser } = useCurrentUser()

    return (
        <nav aria-label="Settings navigation" className="border-b border-[#E5E7EB] bg-white">
            <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
                {settingsNavigation.map((item) => {
                    const Icon = item.icon
                    const active = pathname.startsWith(item.href)
                    const href =
                        item.label === "Profile" && currentUser?.username
                            ? `/u/${currentUser.username}/profile/edit`
                            : item.href

                    return (
                        <Link
                            key={item.label}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E8560A] ${
                                active
                                    ? "border-[#E8560A] text-[#D94F0B]"
                                    : "border-transparent text-[#6B7280] hover:text-[#18181B]"
                            }`}
                        >
                            <Icon size={15} aria-hidden="true" />
                            {item.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
