import type { ReactNode } from "react"

import AppFooter from "@/app/_components/AppFooter"
import AppNoticeManager from "@/app/_components/AppNoticeManager"
import AppShell from "@/app/_components/app-shell/AppShell"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell footer={<AppFooter />} notice={<AppNoticeManager />}>
            {children}
        </AppShell>
    )
}
