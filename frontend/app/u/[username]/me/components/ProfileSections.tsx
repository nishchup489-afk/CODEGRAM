import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    Code2,
    ExternalLink,
    Eye,
    FolderGit2,
    Github,
    Link2,
    MessageSquare,
    Rocket,
    Star,
} from "lucide-react"

import type {
    ProfileLiveProject,
    ProfileProject,
    UserFullProfile,
} from "@/app/_lib/type/profileAnalytics"

type ProfilePanelProps = {
    profile: UserFullProfile
    isOwner: boolean
}

type TimelineEntry = {
    id: string
    title: string
    detail: string
    date: string
    href: string
    source: "GitHub" | "DevManiac"
}

const panelClass = "rounded-xl border border-[#E5E7EB] bg-white"
const keyboardMashPattern = /(asdf|qwer|zxcv|hjkl|kjk|sdfg|dfgh|ghjk|jkl;)/i

function externalUrl(url: string) {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

function cleanCopy(value?: string | null) {
    if (!value?.trim()) return null

    const normalized = value
        .replace(/codegram/gi, "DevManiac")
        .replace(/\bdoesnt\b/gi, "doesn't")
        .replace(/\bdont\b/gi, "don't")
        .replace(/\bcant\b/gi, "can't")
        .replace(/\bwont\b/gi, "won't")
        .replace(/\s+/g, " ")
        .trim()
    const letters = normalized.replace(/[^a-z]/gi, "")
    const vowelCount = letters.match(/[aeiouy]/gi)?.length ?? 0

    if (keyboardMashPattern.test(normalized)) return null
    if (letters.length >= 8 && vowelCount / letters.length < 0.18) return null

    return normalized
}

function displayName(value: string, fallback = "Untitled project") {
    return cleanCopy(value) || fallback
}

function timestamp(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
    }).format(date)
}

function sortedProjects(projects: ProfileProject[]) {
    return [...projects].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
}

function profileSkills(profile: UserFullProfile) {
    const skills = [
        ...profile.projects.flatMap((project) => project.tech_stack ?? []),
        ...profile.live_projects.flatMap((project) => project.tech_stack ?? []),
        ...profile.stack_stats.map((stack) => stack.stack_name),
    ]

    return Array.from(
        new Map(
            skills
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => [skill.toLowerCase(), skill]),
        ).values(),
    )
}

function profileTimeline(profile: UserFullProfile): TimelineEntry[] {
    const projects = profile.projects.map((project) => ({
        id: `project-${project.id}`,
        title: `Published ${displayName(project.title).toLowerCase() === "untitled project" ? "a project" : displayName(project.title)}`,
        detail: cleanCopy(project.description) || "Project shared on DevManiac",
        date: project.created_at,
        href: `/project/${project.slug}`,
        source: project.github_url ? "GitHub" as const : "DevManiac" as const,
    }))

    const liveProjects = profile.live_projects.map((project) => ({
        id: `live-${project.id}`,
        title: `Started ${displayName(project.title).toLowerCase() === "untitled project" ? "a build in public" : displayName(project.title)}`,
        detail: cleanCopy(project.goal) || "Build progress shared on DevManiac",
        date: project.created_at,
        href: `/live_project/${project.slug}`,
        source: "DevManiac" as const,
    }))

    return [...projects, ...liveProjects].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
}

function SectionHeading({
    icon,
    title,
    description,
    action,
}: {
    icon: ReactNode
    title: string
    description: string
    action?: ReactNode
}) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FFF7ED] text-[#E8560A]">
                    {icon}
                </span>
                <div>
                    <h2 className="text-base font-semibold text-[#18181B]">{title}</h2>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{description}</p>
                </div>
            </div>
            {action}
        </div>
    )
}

function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#F8F9FA] px-5 py-9 text-center text-sm text-[#6B7280]">
            {children}
        </div>
    )
}

function ProjectCard({ project }: { project: ProfileProject }) {
    const description = cleanCopy(project.description)
    const title = displayName(project.title)

    return (
        <article className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white transition hover:border-orange-200">
            <div className="flex gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
                    {project.thumbnail_url ? (
                        <Image
                            src={project.thumbnail_url}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                        />
                    ) : (
                        <span className="flex h-full items-center justify-center text-[#9CA3AF]">
                            <FolderGit2 size={23} aria-hidden="true" />
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/project/${project.slug}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#18181B] hover:text-[#C2410C]"
                    >
                        {title}
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#6B7280]">
                        {description || "No description shared yet."}
                    </p>
                </div>
            </div>

            {project.tech_stack?.length ? (
                <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                    {project.tech_stack.slice(0, 5).map((stack) => (
                        <span key={stack} className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs text-[#4B5563]">
                            {stack}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F1F2] px-4 py-3 text-xs text-[#6B7280]">
                <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1"><Eye size={13} />{project.views_count}</span>
                    <span className="inline-flex items-center gap-1"><Star size={13} />{project.stars_count}</span>
                    <span className="inline-flex items-center gap-1"><MessageSquare size={13} />{project.comments_count}</span>
                </div>
                <div className="flex items-center gap-3">
                    {project.github_url ? (
                        <a href={externalUrl(project.github_url)} target="_blank" rel="noreferrer" className="font-medium hover:text-[#C2410C]">
                            GitHub
                        </a>
                    ) : null}
                    {project.live_url ? (
                        <a href={externalUrl(project.live_url)} target="_blank" rel="noreferrer" className="font-medium hover:text-[#C2410C]">
                            Live
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    )
}

function LiveProjectCard({ project }: { project: ProfileLiveProject }) {
    const title = displayName(project.title, "Build in progress")

    return (
        <article className="rounded-lg border border-[#E5E7EB] bg-white p-4 transition hover:border-orange-200">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#E8560A]">In progress</p>
                    <Link href={`/live_project/${project.slug}`} className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#18181B] hover:text-[#C2410C]">
                        {title}
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                </div>
                <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs text-[#4B5563]">{project.status}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#6B7280]">
                {cleanCopy(project.goal) || "No current goal shared yet."}
            </p>
            {project.tech_stack?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 5).map((stack) => (
                        <span key={stack} className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs text-[#4B5563]">{stack}</span>
                    ))}
                </div>
            ) : null}
        </article>
    )
}

function DeveloperActivity({ profile }: { profile: UserFullProfile }) {
    return (
        <section className={`${panelClass} p-5 sm:p-6`}>
            <SectionHeading
                icon={<Activity size={18} aria-hidden="true" />}
                title="Developer Activity"
                description="A record of building, learning, writing, and shipping."
                action={profile.github_url ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                        <Github size={13} aria-hidden="true" /> GitHub connected
                    </span>
                ) : undefined}
            />

            <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-[#FCFCFC] p-4 sm:p-5">
                <div className="grid grid-cols-13 gap-1.5" aria-hidden="true">
                    {Array.from({ length: 91 }, (_, index) => (
                        <span key={index} className="aspect-square rounded-[3px] bg-[#E9ECEF]" />
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
                    <span>Activity history is not synced for this profile yet.</span>
                    <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[3px] bg-[#E9ECEF]" />No synced activity</span>
                </div>
            </div>
        </section>
    )
}

function CurrentFocus({ profile, skills }: { profile: UserFullProfile; skills: string[] }) {
    const projects = sortedProjects(profile.projects)
    const namedFocus = cleanCopy(profile.current_build)
    const matchingProject = namedFocus
        ? projects.find((project) => displayName(project.title).toLowerCase() === displayName(namedFocus).toLowerCase())
        : projects[0]
    const focusTitle = namedFocus ? displayName(namedFocus) : matchingProject ? displayName(matchingProject.title) : null

    return (
        <section className={`${panelClass} p-5 sm:p-6`}>
            <SectionHeading
                icon={<Rocket size={18} aria-hidden="true" />}
                title="Current Focus"
                description="What this developer is building and learning now."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFC] p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#18181B]"><Code2 size={16} className="text-[#E8560A]" />Building</p>
                    {focusTitle ? (
                        <>
                            <p className="mt-3 font-semibold text-[#18181B]">{focusTitle}</p>
                            <p className="mt-1 text-sm leading-5 text-[#6B7280]">
                                {matchingProject ? cleanCopy(matchingProject.description) || "Current project shared on DevManiac." : "Shared as the current build focus."}
                            </p>
                        </>
                    ) : (
                        <p className="mt-3 text-sm text-[#6B7280]">No current build focus has been shared.</p>
                    )}
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFC] p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#18181B]"><BookOpen size={16} className="text-[#E8560A]" />Learning</p>
                    {skills.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {skills.slice(0, 7).map((skill) => (
                                <span key={skill} className="rounded-md bg-white px-2.5 py-1 text-xs text-[#4B5563] ring-1 ring-[#E5E7EB]">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-[#6B7280]">Learning areas have not been shared yet.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

function RecentActivity({ entries, limit }: { entries: TimelineEntry[]; limit?: number }) {
    const visibleEntries = typeof limit === "number" ? entries.slice(0, limit) : entries

    return (
        <section className={`${panelClass} p-5 sm:p-6`}>
            <SectionHeading
                icon={<Activity size={18} aria-hidden="true" />}
                title="Recent Activity"
                description="Factual updates from projects shared on this profile."
            />
            <div className="mt-5">
                {visibleEntries.length ? (
                    <ol className="divide-y divide-[#F0F1F2]">
                        {visibleEntries.map((entry) => (
                            <li key={entry.id} className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E8560A]" />
                                    <div className="min-w-0">
                                        <Link href={entry.href} className="font-medium text-[#18181B] hover:text-[#C2410C]">{entry.title}</Link>
                                        <p className="mt-0.5 truncate text-sm text-[#6B7280]">{entry.detail}</p>
                                    </div>
                                </div>
                                <div className="ml-5 flex items-center gap-2 text-xs text-[#6B7280] sm:ml-0">
                                    <span>{entry.source}</span><span aria-hidden="true">·</span><time dateTime={entry.date}>{timestamp(entry.date)}</time>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <EmptyState>No project activity has been shared yet.</EmptyState>
                )}
            </div>
        </section>
    )
}

function SkillsCard({ skills }: { skills: string[] }) {
    return (
        <section className={`${panelClass} p-5`}>
            <h2 className="text-sm font-semibold text-[#18181B]">Skills</h2>
            <p className="mt-1 text-xs leading-5 text-[#6B7280]">Technologies used across shared work.</p>
            {skills.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span key={skill} className="rounded-lg bg-[#F3F4F6] px-2.5 py-1.5 text-xs font-medium text-[#4B5563]">{skill}</span>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-[#6B7280]">No skills listed yet.</p>
            )}
        </section>
    )
}

function ConnectedSources({ profile, isOwner }: ProfilePanelProps) {
    return (
        <section className={`${panelClass} p-5`}>
            <h2 className="text-sm font-semibold text-[#18181B]">Connected Sources</h2>
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#E5E7EB] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F3F4F6] text-[#18181B]"><Github size={19} /></span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#18181B]">GitHub</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${profile.github_url ? "bg-emerald-50 text-emerald-700" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                            {profile.github_url ? "Connected" : "Not connected"}
                        </span>
                    </div>
                    {profile.github_url ? (
                        <a href={externalUrl(profile.github_url)} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-[#6B7280] hover:text-[#C2410C]">
                            {profile.github_url.replace(/^https?:\/\/(www\.)?github\.com\//i, "@").replace(/\/$/, "")}
                        </a>
                    ) : isOwner ? (
                        <Link href="/settings/github" className="mt-1 inline-block text-xs font-medium text-[#C2410C]">Connect GitHub</Link>
                    ) : (
                        <p className="mt-1 text-xs text-[#6B7280]">No public source connected.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export function ProfileOverview({ profile, isOwner }: ProfilePanelProps) {
    const skills = profileSkills(profile)
    const projects = sortedProjects(profile.projects)
    const entries = profileTimeline(profile)

    return (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
                <DeveloperActivity profile={profile} />
                <CurrentFocus profile={profile} skills={skills} />
                <section className={`${panelClass} p-5 sm:p-6`}>
                    <SectionHeading
                        icon={<FolderGit2 size={18} aria-hidden="true" />}
                        title="Featured Projects"
                        description="Recent work shared on DevManiac."
                    />
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {projects.length ? projects.slice(0, 2).map((project) => <ProjectCard key={project.id} project={project} />) : <div className="md:col-span-2"><EmptyState>No projects published yet.</EmptyState></div>}
                    </div>
                </section>
                <RecentActivity entries={entries} limit={5} />
            </div>
            <aside className="space-y-5">
                <SkillsCard skills={skills} />
                <ConnectedSources profile={profile} isOwner={isOwner} />
                <section className={`${panelClass} p-5`}>
                    <h2 className="text-sm font-semibold text-[#18181B]">Profile links</h2>
                    <div className="mt-3 space-y-2 text-sm">
                        {profile.portfolio_url ? <a href={externalUrl(profile.portfolio_url)} target="_blank" rel="noreferrer" className="flex items-center justify-between text-[#4B5563] hover:text-[#C2410C]">Portfolio <ExternalLink size={14} /></a> : null}
                        {profile.linkedin_url ? <a href={externalUrl(profile.linkedin_url)} target="_blank" rel="noreferrer" className="flex items-center justify-between text-[#4B5563] hover:text-[#C2410C]">LinkedIn <ExternalLink size={14} /></a> : null}
                        {!profile.portfolio_url && !profile.linkedin_url ? <p className="text-sm text-[#6B7280]">No additional links shared.</p> : null}
                    </div>
                </section>
            </aside>
        </div>
    )
}

export function ProfileProjects({ profile }: { profile: UserFullProfile }) {
    const projects = sortedProjects(profile.projects)
    return (
        <div className="space-y-5">
            <section className={`${panelClass} p-5 sm:p-6`}>
                <SectionHeading icon={<FolderGit2 size={18} />} title="Projects" description={`${projects.length} published ${projects.length === 1 ? "project" : "projects"}`} />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} />) : <div className="lg:col-span-2"><EmptyState>No projects published yet.</EmptyState></div>}
                </div>
            </section>
            {profile.live_projects.length ? (
                <section className={`${panelClass} p-5 sm:p-6`}>
                    <SectionHeading icon={<Rocket size={18} />} title="In progress" description="Projects currently being built in public." />
                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                        {profile.live_projects.map((project) => <LiveProjectCard key={project.id} project={project} />)}
                    </div>
                </section>
            ) : null}
        </div>
    )
}

export function ProfileActivity({ profile }: { profile: UserFullProfile }) {
    return (
        <div className="space-y-5">
            <DeveloperActivity profile={profile} />
            <RecentActivity entries={profileTimeline(profile)} />
        </div>
    )
}

export function ProfileTabIcon({ tab }: { tab: "overview" | "projects" | "activity" }) {
    if (tab === "projects") return <FolderGit2 size={15} aria-hidden="true" />
    if (tab === "activity") return <Activity size={15} aria-hidden="true" />
    return <Link2 size={15} aria-hidden="true" />
}
