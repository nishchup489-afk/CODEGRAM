"use client"

import Image from "next/image"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown, LogOut, Plus, Settings, User } from "lucide-react"

import type { CurrentUser } from "@/app/_lib/type/currentUser"
import { getAppNavigation } from "./navigation"

type AppSidebarProps = {
    currentUser: CurrentUser | null
    loading?: boolean
    onNavigate?: () => void
}

function Brand() {
    return (
        <Link href="/" className="flex h-10 items-center gap-2.5 px-2 text-[#18181B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#E8560A] text-sm font-semibold text-white">
                D
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">DevManiac</span>
        </Link>
    )
}

export default function AppSidebar({
    currentUser,
    loading = false,
    onNavigate,
}: AppSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useClerk()
    const menuId = useId()
    const menuRef = useRef<HTMLDivElement>(null)
    const [accountOpen, setAccountOpen] = useState(false)

    const username = currentUser?.username || "loading"
    const navigation = getAppNavigation(username)
    const displayName = currentUser?.display_name || (loading ? "Loading…" : "Developer")

    useEffect(() => {
        if (!accountOpen) return

        function closeOnOutsideClick(event: MouseEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setAccountOpen(false)
            }
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setAccountOpen(false)
        }

        document.addEventListener("mousedown", closeOnOutsideClick)
        document.addEventListener("keydown", closeOnEscape)

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick)
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [accountOpen])

    function finishNavigation() {
        setAccountOpen(false)
        onNavigate?.()
    }

    return (
        <div className="flex h-full flex-col bg-white px-3 py-4 text-[#18181B]">
            <Brand />

            <div className="mt-6">
                <button
                    type="button"
                    disabled
                    aria-describedby="log-work-status"
                    className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#E8560A] px-3 text-sm font-semibold text-white opacity-80"
                >
                    <Plus size={17} aria-hidden="true" />
                    Log work
                    <span id="log-work-status" className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                        Soon
                    </span>
                </button>
            </div>

            <nav aria-label="Main navigation" className="mt-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                    {navigation.map((section, sectionIndex) => (
                        <div key={section.label || `primary-${sectionIndex}`}>
                            {section.label ? (
                                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
                                    {section.label}
                                </p>
                            ) : null}

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    const active = item.match?.(pathname) ?? false
                                    const sharedClassName = `flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E8560A] ${
                                        active
                                            ? "bg-[#FFF4ED] text-[#D94F0B]"
                                            : item.soon
                                              ? "cursor-not-allowed text-[#9CA3AF]"
                                              : "text-[#4B5563] hover:bg-[#F8F9FA] hover:text-[#18181B]"
                                    }`

                                    if (!item.href) {
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                disabled
                                                className={sharedClassName}
                                            >
                                                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                                                <span>{item.label}</span>
                                                {item.soon ? (
                                                    <span className="ml-auto rounded border border-[#E5E7EB] bg-[#FAFAFA] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                                        Soon
                                                    </span>
                                                ) : null}
                                            </button>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={finishNavigation}
                                            aria-current={active ? "page" : undefined}
                                            className={sharedClassName}
                                        >
                                            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            <div ref={menuRef} className="relative mt-4 border-t border-[#E5E7EB] pt-3">
                {accountOpen ? (
                    <div
                        id={menuId}
                        role="menu"
                        className="absolute bottom-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white p-1.5 shadow-[0_10px_30px_rgba(17,24,39,0.08)]"
                    >
                        <Link
                            role="menuitem"
                            href={`/u/${username}/me`}
                            onClick={finishNavigation}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[#4B5563] hover:bg-[#F8F9FA] hover:text-[#18181B] focus-visible:outline-2 focus-visible:outline-[#E8560A]"
                        >
                            <User size={15} aria-hidden="true" /> Profile
                        </Link>
                        <Link
                            role="menuitem"
                            href="/settings"
                            onClick={finishNavigation}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[#4B5563] hover:bg-[#F8F9FA] hover:text-[#18181B] focus-visible:outline-2 focus-visible:outline-[#E8560A]"
                        >
                            <Settings size={15} aria-hidden="true" /> Settings
                        </Link>
                        <button
                            role="menuitem"
                            type="button"
                            onClick={async () => {
                                await signOut()
                                router.push("/")
                                finishNavigation()
                            }}
                            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-[#B42318] hover:bg-[#FEF3F2] focus-visible:outline-2 focus-visible:outline-[#E8560A]"
                        >
                            <LogOut size={15} aria-hidden="true" /> Log out
                        </button>
                    </div>
                ) : null}

                <button
                    type="button"
                    aria-expanded={accountOpen}
                    aria-controls={menuId}
                    aria-haspopup="menu"
                    onClick={() => setAccountOpen((open) => !open)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E8560A]"
                >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F3F4F6]">
                        {currentUser?.avatar_url ? (
                            <Image
                                src={currentUser.avatar_url}
                                alt=""
                                fill
                                sizes="36px"
                                className="object-cover"
                            />
                        ) : (
                            <span className="grid h-full w-full place-items-center text-[#9CA3AF]">
                                <User size={16} aria-hidden="true" />
                            </span>
                        )}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#18181B]">{displayName}</span>
                        <span className="block truncate text-xs text-[#6B7280]">@{username}</span>
                    </span>
                    <ChevronDown
                        size={15}
                        className={`text-[#9CA3AF] transition-transform ${accountOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    )
}
