"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useEffect, useId, useRef, useState } from "react"
import { Bell, Search } from "lucide-react"

function NotificationsButton({ compact = false }: { compact?: boolean }) {
    const [open, setOpen] = useState(false)
    const menuId = useId()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        function closeOnOutsideClick(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", closeOnOutsideClick)
        document.addEventListener("keydown", closeOnEscape)
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick)
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [open])

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label="Notifications"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((value) => !value)}
                className={`grid place-items-center rounded-lg border border-transparent text-[#4B5563] transition-colors hover:border-[#E5E7EB] hover:bg-[#F8F9FA] hover:text-[#18181B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A] ${
                    compact ? "h-9 w-9" : "h-10 w-10"
                }`}
            >
                <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>

            {open ? (
                <div
                    id={menuId}
                    role="dialog"
                    aria-label="Notifications"
                    className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_16px_40px_rgba(17,24,39,0.12)]"
                >
                    <p className="text-sm font-semibold text-[#18181B]">Notifications</p>
                    <p className="mt-3 rounded-lg bg-[#F8F9FA] px-4 py-5 text-center text-xs leading-5 text-[#6B7280]">
                        No notifications to show.
                    </p>
                </div>
            ) : null}
        </div>
    )
}

export function MobileTopBarActions() {
    return (
        <div className="flex items-center gap-1">
            <Link
                href="/search"
                aria-label="Search developers"
                className="grid h-9 w-9 place-items-center rounded-lg text-[#4B5563] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
            >
                <Search size={18} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <NotificationsButton compact />
        </div>
    )
}

export default function AppTopBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const value = query.trim()
        router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search")
    }

    return (
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between gap-6 border-b border-[#E5E7EB] bg-white/95 px-6 backdrop-blur md:flex lg:px-8">
            <form onSubmit={submitSearch} role="search" className="w-full max-w-xl">
                <label className="relative block">
                    <span className="sr-only">Search developers</span>
                    <Search
                        size={17}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search developers…"
                        className="h-10 w-full rounded-lg border border-transparent bg-[#F3F5F7] pl-10 pr-4 text-sm text-[#18181B] outline-none transition placeholder:text-[#6B7280] hover:bg-[#EEF1F4] focus:border-[#D1D5DB] focus:bg-white focus:ring-2 focus:ring-orange-100"
                    />
                </label>
            </form>

            <NotificationsButton />
        </header>
    )
}
