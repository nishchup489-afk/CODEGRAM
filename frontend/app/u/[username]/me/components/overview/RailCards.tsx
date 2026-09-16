import Link from "next/link"
import { Briefcase, CircleCheck, Github, Globe, Instagram, Layers, Linkedin, Mail, ArrowRight, Share2, Twitter, Database } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"
import { Card, CardHeader, externalUrl, handleFromUrl, hostFromUrl } from "./shared"

// ---------------------------------------------------------
// Connect & Share
// ---------------------------------------------------------

export function ConnectShare({
    profile,
    twitterUrl,
    isOwner,
}: {
    profile: UserFullProfile
    twitterUrl: string | null
    isOwner: boolean
}) {
    const links: { label: string; url: string; handle: string; icon: LucideIcon; color: string }[] = []
    if (profile.github_url) links.push({ label: "GitHub", url: profile.github_url, handle: handleFromUrl(profile.github_url), icon: Github, color: "#18181B" })
    if (profile.linkedin_url) links.push({ label: "LinkedIn", url: profile.linkedin_url, handle: handleFromUrl(profile.linkedin_url, false), icon: Linkedin, color: "#0A66C2" })
    if (profile.portfolio_url) links.push({ label: "Portfolio", url: profile.portfolio_url, handle: hostFromUrl(profile.portfolio_url), icon: Globe, color: "#18181B" })
    if (twitterUrl) links.push({ label: "X (Twitter)", url: twitterUrl, handle: handleFromUrl(twitterUrl), icon: Twitter, color: "#18181B" })
    if (profile.instagram_url) links.push({ label: "Instagram", url: profile.instagram_url, handle: handleFromUrl(profile.instagram_url), icon: Instagram, color: "#D62976" })

    return (
        <Card className="p-5" labelledBy="connect-share-title">
            <CardHeader id="connect-share-title" icon={<Share2 size={18} />} title="Connect & Share" />
            {links.length ? (
                <ul className="mt-4 space-y-1">
                    {links.map(({ label, url, handle, icon: Icon, color }) => (
                        <li key={label}>
                            <a
                                href={externalUrl(url)}
                                target="_blank"
                                rel="noreferrer"
                                className="-mx-2 flex items-center gap-3.5 rounded-lg px-2 py-2 hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-[#E8560A]"
                            >
                                <Icon size={21} style={{ color }} aria-hidden="true" />
                                <span className="min-w-0">
                                    <span className="block text-[13px] font-medium text-[#18181B]">{label}</span>
                                    <span className="block truncate text-[12px] text-[#6B7280]">{handle}</span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-[12.5px] text-[#6B7280]">
                    No links yet.{" "}
                    {isOwner ? (
                        <Link href={`/u/${profile.username}/profile/edit`} className="font-medium text-[#D94F0B] hover:underline">
                            Add links
                        </Link>
                    ) : null}
                </p>
            )}
        </Card>
    )
}

// ---------------------------------------------------------
// Quote
// ---------------------------------------------------------

export function QuoteCard({ quote, author }: { quote: string; author: string }) {
    return (
        <figure className="rounded-xl border border-[#DCE7F8] bg-[#EEF4FD] p-5">
            <div className="flex gap-3">
                <span aria-hidden="true" className="-mt-1 font-serif text-[30px] leading-none text-[#4C6FA8]">
                    &ldquo;
                </span>
                <div>
                    <blockquote className="text-[13.5px] leading-5 text-[#1F3A66]">&ldquo;{quote}&rdquo;</blockquote>
                    <figcaption className="mt-2 text-[11.5px] text-[#4C6FA8]">— {author}</figcaption>
                </div>
            </div>
        </figure>
    )
}

// ---------------------------------------------------------
// Skills
// ---------------------------------------------------------

export function SkillsCard({ profile, isOwner }: { profile: UserFullProfile; isOwner: boolean }) {
    const fromStats = [...profile.stack_stats].sort((a, b) => b.score - a.score).map((s) => s.stack_name)
    const fromProjects = [...profile.projects, ...profile.live_projects].flatMap((p) => p.tech_stack || [])
    const skills = Array.from(new Set([...fromStats, ...fromProjects])).slice(0, 12)

    return (
        <Card className="p-5" labelledBy="skills-title">
            <CardHeader
                id="skills-title"
                icon={<Layers size={19} />}
                title="Skills"
                action={
                    isOwner ? (
                        <Link
                            href={`/u/${profile.username}/profile/edit`}
                            className="inline-flex h-8 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[12.5px] font-medium text-[#374151] hover:bg-[#F8F9FA]"
                        >
                            Edit
                        </Link>
                    ) : null
                }
            />
            {skills.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span key={skill} className="rounded-lg border border-[#E8EAEE] bg-[#F7F8FA] px-2.5 py-1.5 text-[12px] font-medium text-[#374151]">
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-[12.5px] text-[#6B7280]">Skills appear once projects are published.</p>
            )}
        </Card>
    )
}

// ---------------------------------------------------------
// Connected sources
// ---------------------------------------------------------

export function ConnectedSources({
    githubUrl,
    importedDays,
    isOwner,
}: {
    githubUrl: string | null
    importedDays: number | null
    isOwner: boolean
}) {
    const connected = Boolean(githubUrl)

    return (
        <Card className="p-5" labelledBy="connected-sources-title">
            <CardHeader id="connected-sources-title" icon={<Database size={19} />} title="Connected Sources" />
            <div className="mt-4 flex items-start gap-3">
                <Github size={34} className="shrink-0 text-[#18181B]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-[#18181B]">GitHub</p>
                        {connected ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#E6F6EE] px-1.5 py-0.5 text-[11px] font-medium text-[#23875A]">
                                <CircleCheck size={11} aria-hidden="true" /> Connected
                            </span>
                        ) : isOwner ? (
                            <Link href="/settings/github" className="text-[12px] font-medium text-[#D94F0B] hover:underline">
                                Connect
                            </Link>
                        ) : (
                            <span className="text-[11px] text-[#9CA3AF]">Not connected</span>
                        )}
                    </div>
                    <p className="truncate text-[12px] text-[#6B7280]">{connected && githubUrl ? handleFromUrl(githubUrl) : "Not connected yet"}</p>
                    {connected && importedDays !== null ? (
                        <p className="mt-0.5 text-[12px] text-[#4B5563]">{importedDays} days of activity imported</p>
                    ) : null}
                </div>
            </div>
        </Card>
    )
}

// ---------------------------------------------------------
// Open to opportunities
// ---------------------------------------------------------

export function OpportunitiesCard({ note, email }: { note: string | null; email: string | null }) {
    return (
        <section aria-labelledby="opportunities-title" className="rounded-xl border border-[#FBE3D5] bg-[#FFF5EF] p-5">
            <div className="flex items-center gap-2.5">
                <Briefcase size={18} className="text-[#E8560A]" aria-hidden="true" />
                <h2 id="opportunities-title" className="text-[14px] font-semibold text-[#C2410C]">
                    Open to Opportunities
                </h2>
            </div>
            <p className="mt-2 text-[12.5px] leading-5 text-[#4B5563]">
                {note || "Actively looking for internships and exciting opportunities."}
            </p>
            {email ? (
                <div className="mt-3 flex justify-end">
                    <a
                        href={`mailto:${email}`}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-[12.5px] font-medium text-[#18181B] hover:bg-[#F8F9FA]"
                    >
                        <Mail size={14} aria-hidden="true" /> Get in touch <ArrowRight size={13} aria-hidden="true" />
                    </a>
                </div>
            ) : null}
        </section>
    )
}
