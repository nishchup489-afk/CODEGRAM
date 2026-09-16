"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"

import useCurrentUser from "@/app/_lib/currentUser"
import AppSidebar from "./AppSidebar"
import AppTopBar, { MobileTopBarActions } from "./AppTopBar"

type AppShellProps = {
    children: ReactNode
    footer?: ReactNode
    notice?: ReactNode
}

export default function AppShell({ children, footer, notice }: AppShellProps) {
    const { currentUser, loading, error } = useCurrentUser()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const drawerRef = useRef<HTMLElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!drawerOpen) return

        const previousOverflow = document.body.style.overflow
        const drawer = drawerRef.current
        const menuButton = menuButtonRef.current
        const focusable = drawer?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )

        document.body.style.overflow = "hidden"
        focusable?.[0]?.focus()

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setDrawerOpen(false)
                return
            }

            if (event.key !== "Tab" || !focusable?.length) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", handleKeyDown)
            menuButton?.focus()
        }
    }, [drawerOpen])

    return (
        <div className="app-v2 min-h-screen bg-white text-[#18181B]">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-[#E5E7EB] bg-white md:block">
                <AppSidebar currentUser={currentUser} loading={loading} />
            </aside>

            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur md:hidden">
                <button
                    ref={menuButtonRef}
                    type="button"
                    aria-label="Open navigation"
                    aria-expanded={drawerOpen}
                    onClick={() => setDrawerOpen(true)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                >
                    <Menu size={19} aria-hidden="true" />
                </button>

                <span className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold tracking-[-0.02em]">DevManiac</span>
                <MobileTopBarActions />
            </header>

            {drawerOpen ? (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setDrawerOpen(false)}
                        className="absolute inset-0 bg-[#18181B]/35"
                    />
                    <aside
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className="relative h-full w-[min(88vw,280px)] border-r border-[#E5E7EB] bg-white shadow-[12px_0_40px_rgba(17,24,39,0.12)]"
                    >
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() => setDrawerOpen(false)}
                            className="absolute right-3 top-4 z-10 grid h-10 w-10 place-items-center rounded-lg text-[#6B7280] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-[#E8560A]"
                        >
                            <X size={19} aria-hidden="true" />
                        </button>
                        <AppSidebar
                            currentUser={currentUser}
                            loading={loading}
                            onNavigate={() => setDrawerOpen(false)}
                        />
                    </aside>
                </div>
            ) : null}

            <div className="min-w-0 md:pl-60">
                <AppTopBar />
                {error ? (
                    <div role="alert" className="border-b border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B42318] md:px-8">
                        {error}
                    </div>
                ) : null}
                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
                {footer}
            </div>

            {notice}
        </div>
    )
}
