"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Clock3,
    Eye,
    FolderGit2,
    GitBranch,
    MessageCircle,
    Plus,
    Rocket,
    Star,
} from "lucide-react"

import api from "@/app/_lib/api"
import useCurrentUser from "@/app/_lib/currentUser"

type DashboardStats = {
    total_projects: number
    total_live_projects: number
    total_views: number
    total_stars: number
    total_comments: number
    total_journals: number
}

type DashboardProject = {
    id: string
    title: string
    slug: string
    views_count: number
    stars_count: number
    comments_count: number
    tech_stack: string[]
    created_at: string
}

type DashboardLiveProject = {
    id: string
    title: string
    slug: string
    goal: string
    current_goal: string | null
    progress_percentage: number
    status: string
    views_count: number
    journal_count: number
    tech_stack: string[]
    created_at: string
    updated_at: string | null
}

type DashboardStackStat = {
    stack_name: string
    projects_count: number
    live_projects_count: number
    score: number
}

type DashboardFeedEvent = {
    id: string
    event_type: string
    content: string | null
    created_at: string
}

type DashboardData = {
    username: string
    display_name: string | null
    avatar_url: string | null
    stats: DashboardStats
    recent_projects: DashboardProject[]
    active_live_projects: DashboardLiveProject[]
    top_stacks: DashboardStackStat[]
    recent_activity: DashboardFeedEvent[]
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
        notation: value >= 1000 ? "compact" : "standard",
        maximumFractionDigits: 1,
    }).format(value)
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(new Date(date))
}

function getEventLabel(eventType: string) {
    const labels: Record<string, string> = {
        live_project_created: "Started a live project",
        journal_published: "Published a journal",
        project_created: "Published a project",
    }

    return labels[eventType] || eventType.replaceAll("_", " ")
}

export default function Dashboard() {
    const { currentUser, loading: userLoading } = useCurrentUser()
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (userLoading) return

        if (!currentUser) return

        async function fetchDashboard() {
            try {
                setLoading(true)
                setError("")
                const response = await api.get("/dashboard")
                setDashboard(response.data)
            } catch (requestError) {
                console.error(requestError)
                setError("Failed to load dashboard")
            } finally {
                setLoading(false)
            }
        }

        void fetchDashboard()
    }, [userLoading, currentUser])

    if (loading || userLoading) {
        return <DashboardStatus message="Loading your workspace…" />
    }

    if (!currentUser) {
        return (
            <DashboardStatus
                title="You need to sign in"
                message="Your workspace is available after you sign in."
                action={{ href: "/sign-in", label: "Sign in" }}
            />
        )
    }

    if (error) {
        return <DashboardStatus title="Dashboard failed" message={error} />
    }

    if (!dashboard) {
        return <DashboardStatus title="Nothing to show yet" message="No dashboard data was found." />
    }

    const displayName =
        currentUser.display_name || dashboard.display_name || currentUser.username || dashboard.username
    const firstName = displayName.split(" ")[0]
    const avatarUrl = currentUser.avatar_url || dashboard.avatar_url
    const userRoot = `/u/${currentUser.username}`

    const stats = [
        { label: "Projects", value: dashboard.stats.total_projects, icon: FolderGit2 },
        { label: "Live builds", value: dashboard.stats.total_live_projects, icon: Rocket },
        { label: "Views", value: dashboard.stats.total_views, icon: Eye },
        { label: "Stars", value: dashboard.stats.total_stars, icon: Star },
        { label: "Comments", value: dashboard.stats.total_comments, icon: MessageCircle },
        { label: "Journals", value: dashboard.stats.total_journals, icon: GitBranch },
    ]

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F3F4F6]">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt=""
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="grid h-full w-full place-items-center text-base font-semibold text-[#6B7280]">
                                    {displayName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-[#E8560A]">Your workspace</p>
                            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-[#18181B] sm:text-3xl">
                                Welcome back, {firstName}
                            </h1>
                            <p className="mt-2 text-sm text-[#6B7280]">
                                Track what you&apos;re building and your developer activity.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                            href={`${userRoot}/me`}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                        >
                            View profile
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                        <Link
                            href={`${userRoot}/create/project`}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#E8560A] px-4 text-sm font-semibold text-white hover:bg-[#CF4B08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                        >
                            <Plus size={16} aria-hidden="true" />
                            New project
                        </Link>
                    </div>
                </header>

                <section aria-label="Workspace statistics" className="grid grid-cols-2 border-b border-[#E5E7EB] md:grid-cols-3 xl:grid-cols-6">
                    {stats.map((stat, index) => (
                        <StatItem key={stat.label} {...stat} last={index === stats.length - 1} />
                    ))}
                </section>

                <div className="grid gap-10 py-10 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <section aria-labelledby="active-builds-title">
                        <SectionHeader
                            id="active-builds-title"
                            icon={<Rocket size={17} aria-hidden="true" />}
                            title="Active live builds"
                            description="Projects you are currently building in public."
                            href={`${userRoot}/live_projects`}
                        />

                        {dashboard.active_live_projects.length === 0 ? (
                            <EmptyState
                                title="No active live builds"
                                description="Start a live project when you are ready to share your progress."
                                href="/live_project/create"
                                action="Start a live build"
                            />
                        ) : (
                            <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                                {dashboard.active_live_projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/live_project/${project.slug}`}
                                        className="group block py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8560A]"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-[#18181B] group-hover:text-[#D94F0B]">
                                                        {project.title}
                                                    </h3>
                                                    <span className="rounded border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-medium capitalize text-[#C2410C]">
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                                                    {project.current_goal || project.goal}
                                                </p>
                                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#9CA3AF]">
                                                    {project.tech_stack.slice(0, 5).map((stack) => (
                                                        <span key={stack} className="rounded bg-[#F3F4F6] px-2 py-1 text-[#6B7280]">
                                                            {stack}
                                                        </span>
                                                    ))}
                                                    <span>Updated {formatDate(project.updated_at || project.created_at)}</span>
                                                </div>
                                            </div>

                                            <div className="w-full shrink-0 sm:w-36">
                                                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                                                    <span>Progress</span>
                                                    <span className="font-semibold text-[#18181B]">{project.progress_percentage}%</span>
                                                </div>
                                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                                                    <div
                                                        className="h-full rounded-full bg-[#E8560A]"
                                                        style={{ width: `${Math.min(Math.max(project.progress_percentage, 0), 100)}%` }}
                                                    />
                                                </div>
                                                <div className="mt-3 flex gap-3 text-[11px] text-[#9CA3AF]">
                                                    <span>{formatNumber(project.views_count)} views</span>
                                                    <span>{formatNumber(project.journal_count)} journals</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="space-y-8 xl:border-l xl:border-[#E5E7EB] xl:pl-8" aria-label="Workspace insights">
                        <section>
                            <div className="flex items-center gap-2 text-[#E8560A]">
                                <Activity size={17} aria-hidden="true" />
                                <h2 className="text-sm font-semibold text-[#18181B]">Builder momentum</h2>
                            </div>
                            <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#18181B]">
                                {dashboard.recent_activity.length}
                            </p>
                            <p className="mt-1 text-sm text-[#6B7280]">recent actions recorded</p>
                        </section>

                        <section className="border-t border-[#E5E7EB] pt-8">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={17} className="text-[#E8560A]" aria-hidden="true" />
                                <h2 className="text-sm font-semibold text-[#18181B]">Top stacks</h2>
                            </div>

                            {dashboard.top_stacks.length === 0 ? (
                                <p className="mt-4 text-sm leading-6 text-[#6B7280]">
                                    Stack stats appear after you publish projects.
                                </p>
                            ) : (
                                <div className="mt-5 space-y-4">
                                    {dashboard.top_stacks.map((stack) => {
                                        const count = stack.projects_count + stack.live_projects_count
                                        const maxCount = Math.max(
                                            ...dashboard.top_stacks.map(
                                                (item) => item.projects_count + item.live_projects_count,
                                            ),
                                            1,
                                        )

                                        return (
                                            <div key={stack.stack_name}>
                                                <div className="mb-1.5 flex items-center justify-between text-xs">
                                                    <span className="font-medium text-[#4B5563]">{stack.stack_name}</span>
                                                    <span className="text-[#9CA3AF]">{count}</span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                                                    <div
                                                        className="h-full rounded-full bg-[#E8560A]"
                                                        style={{ width: `${(count / maxCount) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>
                    </aside>
                </div>

                <div className="grid gap-10 border-t border-[#E5E7EB] pt-10 xl:grid-cols-2">
                    <section aria-labelledby="recent-projects-title">
                        <SectionHeader
                            id="recent-projects-title"
                            icon={<FolderGit2 size={17} aria-hidden="true" />}
                            title="Recent projects"
                            href={`${userRoot}/projects`}
                        />

                        {dashboard.recent_projects.length === 0 ? (
                            <EmptyState
                                title="No projects yet"
                                description="Publish your first completed project."
                                href={`${userRoot}/create/project`}
                                action="Create project"
                            />
                        ) : (
                            <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                                {dashboard.recent_projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/project/${project.slug}`}
                                        className="group flex items-center justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8560A]"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-[#18181B] group-hover:text-[#D94F0B]">
                                                {project.title}
                                            </h3>
                                            <p className="mt-1 truncate text-xs text-[#6B7280]">
                                                {project.tech_stack?.slice(0, 4).join(" · ") || "No stack listed"}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 gap-3 text-xs text-[#9CA3AF]">
                                            <span>{formatNumber(project.views_count)} views</span>
                                            <span>{formatNumber(project.stars_count)} stars</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <section aria-labelledby="recent-activity-title">
                        <SectionHeader
                            id="recent-activity-title"
                            icon={<Clock3 size={17} aria-hidden="true" />}
                            title="Recent activity"
                        />

                        {dashboard.recent_activity.length === 0 ? (
                            <div className="border-y border-[#E5E7EB] py-10 text-center text-sm text-[#6B7280]">
                                No recent activity.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                                {dashboard.recent_activity.map((event) => (
                                    <div key={event.id} className="flex gap-3 py-4">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E8560A]" aria-hidden="true" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <p className="text-sm font-medium text-[#18181B]">
                                                    {getEventLabel(event.event_type)}
                                                </p>
                                                <time className="shrink-0 text-xs text-[#9CA3AF]" dateTime={event.created_at}>
                                                    {formatDate(event.created_at)}
                                                </time>
                                            </div>
                                            {event.content ? (
                                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6B7280]">{event.content}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

function StatItem({
    label,
    value,
    icon: Icon,
    last,
}: {
    label: string
    value: number
    icon: typeof FolderGit2
    last: boolean
}) {
    return (
        <div className={`px-4 py-6 sm:px-5 ${last ? "" : "border-r border-[#E5E7EB]"}`}>
            <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                {label}
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#18181B]">{formatNumber(value)}</p>
        </div>
    )
}

function SectionHeader({
    id,
    icon,
    title,
    description,
    href,
}: {
    id: string
    icon: React.ReactNode
    title: string
    description?: string
    href?: string
}) {
    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 text-[#E8560A]">
                    {icon}
                    <h2 id={id} className="text-base font-semibold text-[#18181B]">{title}</h2>
                </div>
                {description ? <p className="mt-1.5 text-sm text-[#6B7280]">{description}</p> : null}
            </div>
            {href ? (
                <Link
                    href={href}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#6B7280] hover:text-[#D94F0B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                >
                    View all <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
            ) : null}
        </div>
    )
}

function EmptyState({
    title,
    description,
    href,
    action,
}: {
    title: string
    description: string
    href: string
    action: string
}) {
    return (
        <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#FAFAFA] px-5 py-10 text-center">
            <h3 className="text-sm font-semibold text-[#18181B]">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">{description}</p>
            <Link
                href={href}
                className="mt-5 inline-flex h-9 items-center rounded-lg bg-[#E8560A] px-3.5 text-sm font-semibold text-white hover:bg-[#CF4B08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
            >
                {action}
            </Link>
        </div>
    )
}

function DashboardStatus({
    title,
    message,
    action,
}: {
    title?: string
    message: string
    action?: { href: string; label: string }
}) {
    return (
        <div className="grid min-h-[70vh] place-items-center bg-white px-4 text-center">
            <div>
                {title ? <h1 className="text-xl font-semibold text-[#18181B]">{title}</h1> : null}
                <p className={`${title ? "mt-2" : ""} text-sm text-[#6B7280]`}>{message}</p>
                {action ? (
                    <Link
                        href={action.href}
                        className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#E8560A] px-4 text-sm font-semibold text-white hover:bg-[#CF4B08]"
                    >
                        {action.label}
                    </Link>
                ) : null}
            </div>
        </div>
    )
}
