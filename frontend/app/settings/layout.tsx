import type { ReactNode } from "react"

import AppShell from "@/app/_components/app-shell/AppShell"
import SettingsNavigation from "./SettingsNavigation"

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell>
            <header className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E8560A]">
                        Workspace
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#18181B] sm:text-3xl">
                        Settings
                    </h1>
                    <p className="mt-2 text-sm text-[#6B7280]">
                        Manage your account, profile, integrations, and support.
                    </p>
                </div>
            </header>
            <SettingsNavigation />
            <div className="settings-v2-content">{children}</div>
        </AppShell>
    )
}
