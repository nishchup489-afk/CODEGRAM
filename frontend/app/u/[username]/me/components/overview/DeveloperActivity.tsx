"use client"

import { useEffect, useMemo, useRef } from "react"
import { ChevronDown, Target } from "lucide-react"

import type { ActivityDay } from "@/app/_lib/type/profileActivity"
import { CATEGORY_META, CATEGORY_ORDER, Card, CardHeader, dayTotal, dominantCategory, toDateKey } from "./shared"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const EMPTY = "#EEF0F3"

type Cell = { key: string; date: Date; inRange: boolean }

function buildWeeks(today: Date) {
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = new Date(end)
    start.setDate(start.getDate() - 364)
    // Rewind to Monday so each column is a full Mon–Sun week.
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7))

    const weeks: Cell[][] = []
    const cursor = new Date(start)
    while (cursor <= end) {
        const week: Cell[] = []
        for (let i = 0; i < 7; i++) {
            week.push({ key: toDateKey(cursor), date: new Date(cursor), inRange: cursor <= end })
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }
    return weeks
}

export default function DeveloperActivity({ days }: { days: ActivityDay[] }) {
    const { weeks, byDate, monthLabels, activeCount } = useMemo(() => {
        const weeks = buildWeeks(new Date())
        const byDate = new Map(days.map((day) => [day.date, day]))
        const monthLabels: { index: number; label: string }[] = []
        let lastMonth = -1
        weeks.forEach((week, index) => {
            const month = week[0].date.getMonth()
            if (month !== lastMonth) {
                // Skip a label squeezed into the very first partial column.
                if (index > 0 || week[0].date.getDate() <= 7) {
                    monthLabels.push({ index, label: week[0].date.toLocaleString("en-US", { month: "short" }) })
                }
                lastMonth = month
            }
        })
        const activeCount = days.filter((day) => dayTotal(day) > 0).length
        return { weeks, byDate, monthLabels, activeCount }
    }, [days])

    // On narrow screens the grid scrolls; start at the most recent weeks.
    const scrollRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [])

    return (
        <Card className="p-5" labelledBy="developer-activity-title">
            <CardHeader
                id="developer-activity-title"
                icon={<Target size={20} strokeWidth={2} />}
                title="Developer Activity"
                description="A year of building, learning, shipping, and contributing."
                action={
                    <div className="relative">
                        <select
                            aria-label="Activity range"
                            defaultValue="12m"
                            className="h-8 appearance-none rounded-lg border border-[#E5E7EB] bg-white pl-3 pr-8 text-[12.5px] font-medium text-[#374151] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                        >
                            <option value="12m">Last 12 months</option>
                        </select>
                        <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    </div>
                }
            />

            <div ref={scrollRef} className="mt-5 overflow-x-auto pb-1">
                <div className="min-w-[640px]">
                    <div
                        className="grid gap-[3px]"
                        style={{ gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 1fr))` }}
                    >
                        <span />
                        {weeks.map((_, index) => {
                            const label = monthLabels.find((m) => m.index === index)
                            return (
                                <span key={index} className="relative h-4 text-[10.5px] text-[#6B7280]">
                                    {label ? <span className="absolute left-0 top-0 whitespace-nowrap">{label.label}</span> : null}
                                </span>
                            )
                        })}

                        {WEEKDAYS.map((weekday, row) => (
                            <Row key={weekday} weekday={weekday} row={row} weeks={weeks} byDate={byDate} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#4B5563]">
                {CATEGORY_ORDER.map((category) => (
                    <span key={category} className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CATEGORY_META[category].color }} />
                        {CATEGORY_META[category].label}
                    </span>
                ))}
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: EMPTY }} />
                    No activity
                </span>
                {activeCount === 0 ? (
                    <span className="text-[#9CA3AF] sm:ml-auto">No activity recorded yet</span>
                ) : null}
            </div>
        </Card>
    )
}

function Row({
    weekday,
    row,
    weeks,
    byDate,
}: {
    weekday: string
    row: number
    weeks: Cell[][]
    byDate: Map<string, ActivityDay>
}) {
    return (
        <>
            <span className="flex items-center text-[10.5px] leading-none text-[#6B7280]">{weekday}</span>
            {weeks.map((week) => {
                const cell = week[row]
                if (!cell.inRange) return <span key={cell.key} className="aspect-square" />

                const day = byDate.get(cell.key)
                const total = dayTotal(day)
                const category = dominantCategory(day)
                const color = category ? CATEGORY_META[category].color : EMPTY
                const opacity = total === 0 ? 1 : total >= 4 ? 1 : total >= 2 ? 0.8 : 0.55
                const dateLabel = cell.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

                return (
                    <span
                        key={cell.key}
                        title={total ? `${total} ${total === 1 ? "entry" : "entries"} · ${dateLabel}` : `No activity · ${dateLabel}`}
                        className="aspect-square rounded-[3px]"
                        style={{ background: color, opacity }}
                    />
                )
            })}
        </>
    )
}
