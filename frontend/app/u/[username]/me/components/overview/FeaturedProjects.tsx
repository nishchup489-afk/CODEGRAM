import Link from "next/link"
import { ArrowRight, Eye, Folder, MessageCircle, Star } from "lucide-react"

import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"
import { Card, CardHeader, Chip, outlineButton } from "./shared"
import ProjectThumb from "./ProjectThumb"

export default function FeaturedProjects({
    profile,
    isOwner,
    onViewAll,
}: {
    profile: UserFullProfile
    isOwner: boolean
    onViewAll: () => void
}) {
    const featured = [...profile.projects]
        .sort((a, b) => b.stars_count - a.stars_count || b.views_count - a.views_count)
        .slice(0, 2)

    return (
        <Card className="p-5" labelledBy="featured-projects-title">
            <CardHeader
                id="featured-projects-title"
                icon={<Folder size={20} />}
                title="Featured Projects"
                action={
                    profile.projects.length ? (
                        <button type="button" onClick={onViewAll} className={outlineButton}>
                            View all <ArrowRight size={13} aria-hidden="true" />
                        </button>
                    ) : null
                }
            />

            {featured.length === 0 ? (
                <div className="mt-5 rounded-lg border border-dashed border-[#D9DCE1] px-4 py-8 text-center">
                    <p className="text-[13px] text-[#6B7280]">No projects published yet.</p>
                    {isOwner ? (
                        <Link
                            href={`/u/${profile.username}/create/project`}
                            className="mt-3 inline-flex h-8 items-center rounded-lg bg-[#E8560A] px-3 text-[12.5px] font-semibold text-white hover:bg-[#CF4B08]"
                        >
                            Publish a project
                        </Link>
                    ) : null}
                </div>
            ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {featured.map((project, index) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.slug}`}
                            className="group flex flex-col rounded-lg border border-[#E8EAEE] p-4 transition-colors hover:border-[#D1D5DB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                        >
                            <div className="flex items-start gap-3">
                                <ProjectThumb seed={project.slug} src={project.thumbnail_url} size="lg" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="truncate text-[13.5px] font-semibold text-[#18181B] group-hover:text-[#D94F0B]">
                                            {project.title}
                                        </h3>
                                        {index === 0 ? (
                                            <span className="shrink-0 rounded-md bg-[#FFF1E0] px-1.5 py-0.5 text-[11px] font-medium text-[#D9770F]">
                                                Featured
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[#6B7280]">
                                        {project.description || "No description yet."}
                                    </p>
                                </div>
                            </div>

                            {project.tech_stack?.length ? (
                                <div className="mt-3.5 flex flex-wrap gap-1.5">
                                    {project.tech_stack.slice(0, 4).map((s) => (
                                        <Chip key={s}>{s}</Chip>
                                    ))}
                                </div>
                            ) : null}

                            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-3.5 text-[12px] text-[#4B5563]">
                                <span className="inline-flex items-center gap-1.5">
                                    <Star size={13} className="text-[#F2B927]" aria-hidden="true" />
                                    {project.stars_count} stars
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Eye size={13} className="text-[#3FAE7A]" aria-hidden="true" />
                                    {project.views_count} views
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <MessageCircle size={13} className="text-[#4C8DF6]" aria-hidden="true" />
                                    {project.comments_count} comments
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Card>
    )
}
