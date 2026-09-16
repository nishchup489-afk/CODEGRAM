import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, BookOpen, CodeXml, Target } from "lucide-react"

import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"
import { Card, CardHeader, Chip } from "./shared"
import ProjectThumb from "./ProjectThumb"

export default function CurrentFocus({ profile, learning }: { profile: UserFullProfile; learning: string[] }) {
    const live = profile.live_projects.find((p) => p.status !== "completed") ?? profile.live_projects[0]

    const building = live
        ? {
              title: live.title,
              description: live.current_goal || live.goal,
              stack: live.tech_stack,
              href: `/live_project/${live.slug}`,
              seed: live.slug,
          }
        : profile.current_build
          ? { title: profile.current_build, description: null, stack: [], href: null, seed: profile.current_build }
          : null

    return (
        <Card className="p-5" labelledBy="current-focus-title">
            <CardHeader
                id="current-focus-title"
                icon={<Target size={20} />}
                title="Current Focus"
                description="What I'm working on and learning right now."
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                    <h3 className="mb-2.5 flex items-center gap-2 text-[13.5px] font-semibold text-[#18181B]">
                        <CodeXml size={17} className="text-[#4F46E5]" aria-hidden="true" />
                        Building
                    </h3>
                    {building ? (
                        <div className="flex items-center gap-3 rounded-lg border border-[#E8EAEE] p-3">
                            <ProjectThumb seed={building.seed} size="md" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12.5px] font-bold uppercase tracking-[0.01em] text-[#18181B]">{building.title}</p>
                                {building.description ? (
                                    <p className="mt-0.5 line-clamp-1 text-[12px] text-[#6B7280]">{building.description}</p>
                                ) : null}
                                {building.stack.length ? (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {building.stack.slice(0, 3).map((s) => (
                                            <Chip key={s}>{s}</Chip>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            {building.href ? (
                                <Link
                                    href={building.href}
                                    aria-label={`Open ${building.title}`}
                                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#E5E7EB] text-[#18181B] hover:bg-[#F8F9FA]"
                                >
                                    <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                            ) : null}
                        </div>
                    ) : (
                        <EmptyBox>Nothing in progress right now.</EmptyBox>
                    )}
                </div>

                <div>
                    <h3 className="mb-2.5 flex items-center gap-2 text-[13.5px] font-semibold text-[#18181B]">
                        <BookOpen size={17} className="text-[#2563EB]" aria-hidden="true" />
                        Learning
                    </h3>
                    <div className="rounded-lg border border-[#E8EAEE] p-3">
                        <p className="text-[12px] text-[#6B7280]">Improving my skills in:</p>
                        {learning.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {learning.map((item) => (
                                    <Chip key={item}>{item}</Chip>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-[12px] text-[#9CA3AF]">Nothing listed yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

function EmptyBox({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg border border-dashed border-[#D9DCE1] px-3 py-5 text-center text-[12px] text-[#9CA3AF]">
            {children}
        </div>
    )
}
