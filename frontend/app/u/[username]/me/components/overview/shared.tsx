import type { ReactNode } from "react"

import type { ActivityCategory, ActivityDay, ActivitySource } from "@/app/_lib/type/profileActivity"

export const CATEGORY_ORDER: ActivityCategory[] = ["build", "learn", "ship", "collaborate", "contribute"]

export const CATEGORY_META: Record<ActivityCategory, { label: string; color: string }> = {
    build: { label: "Build", color: "#3FAE7A" },
    learn: { label: "Learn", color: "#4C8DF6" },
    ship: { label: "Ship", color: "#F26B2A" },
    collaborate: { label: "Collaborate", color: "#A970F0" },
    contribute: { label: "Contribute", color: "#F2B927" },
}

export const SOURCE_LABEL: Record<ActivitySource, string> = {
    github: "GitHub",
    gitlab: "GitLab",
    leetcode: "Self logged",
    manual: "Self logged",
    devto: "DEV",
    hashnode: "Hashnode",
    import: "Imported",
    system: "DevManiac",
}

export function Card({
    children,
    className = "",
    labelledBy,
}: {
    children: ReactNode
    className?: string
    labelledBy?: string
}) {
    return (
        <section
            aria-labelledby={labelledBy}
            className={`rounded-xl border border-[#E8EAEE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}
        >
            {children}
        </section>
    )
}

export function CardHeader({
    icon,
    title,
    description,
    action,
    id,
}: {
    icon: ReactNode
    title: string
    description?: string
    action?: ReactNode
    id?: string
}) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 text-[#18181B]" aria-hidden="true">
                    {icon}
                </span>
                <div className="min-w-0">
                    <h2 id={id} className="text-[15px] font-semibold tracking-[-0.01em] text-[#18181B]">
                        {title}
                    </h2>
                    {description ? <p className="mt-0.5 text-[13px] text-[#6B7280]">{description}</p> : null}
                </div>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    )
}

export function Chip({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md border border-[#E8EAEE] bg-[#F7F8FA] px-2 py-0.5 text-[11.5px] font-medium text-[#4B5563]">
            {children}
        </span>
    )
}

export const outlineButton =
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 text-[12.5px] font-medium text-[#374151] transition-colors hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"

export function toDateKey(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export function dayTotal(day: ActivityDay | undefined) {
    if (!day) return 0
    return Object.values(day.counts).reduce((sum, n) => sum + (n || 0), 0)
}

export function dominantCategory(day: ActivityDay | undefined): ActivityCategory | null {
    if (!day) return null
    let best: ActivityCategory | null = null
    let bestCount = 0
    for (const category of CATEGORY_ORDER) {
        const count = day.counts[category] || 0
        if (count > bestCount) {
            best = category
            bestCount = count
        }
    }
    return best
}

export function externalUrl(url: string) {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

export function handleFromUrl(url: string, withAt = true) {
    try {
        const parsed = new URL(externalUrl(url))
        const segment = parsed.pathname.split("/").filter(Boolean).pop()
        if (!segment || segment === "in") return parsed.hostname.replace(/^www\./, "")
        return withAt ? `@${segment}` : segment
    } catch {
        return url
    }
}

export function hostFromUrl(url: string) {
    try {
        const parsed = new URL(externalUrl(url))
        return (parsed.hostname + parsed.pathname).replace(/^www\./, "").replace(/\/$/, "")
    } catch {
        return url
    }
}

export function relativeTime(iso: string, now = new Date()) {
    const date = new Date(iso)
    const diffMs = now.getTime() - date.getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24 && date.getDate() === now.getDate()) return `${hours} hour${hours === 1 ? "" : "s"} ago`

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const days = Math.round((startOfToday - startOfDate) / 86400000)
    if (days <= 1) return days === 0 ? `${Math.max(hours, 1)} hours ago` : "Yesterday"

    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}
