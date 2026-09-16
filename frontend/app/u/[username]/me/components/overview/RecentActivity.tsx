import { Activity, ArrowRight, Github } from "lucide-react"

import type { ProfileRecentActivity } from "@/app/_lib/type/profileActivity"
import { CATEGORY_META, Card, CardHeader, SOURCE_LABEL, outlineButton, relativeTime } from "./shared"

export default function RecentActivity({
    items,
    limit,
    onViewAll,
}: {
    items: ProfileRecentActivity[]
    limit?: number
    onViewAll?: () => void
}) {
    const visible = limit ? items.slice(0, limit) : items

    return (
        <Card className="p-5" labelledBy="recent-activity-title">
            <CardHeader
                id="recent-activity-title"
                icon={<Activity size={20} />}
                title="Recent Activity"
                description="Latest activity from my journey."
                action={
                    onViewAll && items.length ? (
                        <button type="button" onClick={onViewAll} className={outlineButton}>
                            View all <ArrowRight size={13} aria-hidden="true" />
                        </button>
                    ) : null
                }
            />

            {visible.length === 0 ? (
                <p className="mt-5 rounded-lg border border-dashed border-[#D9DCE1] px-4 py-8 text-center text-[13px] text-[#6B7280]">
                    Activity will show up here once work is logged or GitHub activity is imported.
                </p>
            ) : (
                <ul className="mt-4">
                    {visible.map((item) => (
                        <li key={item.id} className="flex items-start gap-4 py-2.5">
                            <span
                                aria-hidden="true"
                                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ background: CATEGORY_META[item.category].color }}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13.5px] text-[#18181B]">{item.title}</p>
                                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[10.5px] uppercase tracking-[0.03em] text-[#6B7280]">
                                    {item.context ? <span>{item.context} ·</span> : null}
                                    <span>{CATEGORY_META[item.category].label} ·</span>
                                    <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                                        {item.source === "github" ? <Github size={11} aria-hidden="true" /> : null}
                                        {SOURCE_LABEL[item.source]}
                                    </span>
                                </p>
                            </div>
                            <time dateTime={item.occurred_at} className="shrink-0 pt-0.5 text-[11.5px] text-[#6B7280]">
                                {relativeTime(item.occurred_at)}
                            </time>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    )
}
