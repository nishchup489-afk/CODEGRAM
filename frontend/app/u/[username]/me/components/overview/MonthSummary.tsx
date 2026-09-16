"use client"

import { useMemo } from "react"
import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react"

import type { ActivityCategory, ActivityDay } from "@/app/_lib/type/profileActivity"
import { CATEGORY_META, CATEGORY_ORDER, dayTotal } from "./shared"

function monthStats(days: ActivityDay[], year: number, month: number) {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
    const inMonth = days.filter((day) => day.date.startsWith(prefix))
    const categoryDays = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0])) as Record<ActivityCategory, number>
    let active = 0
    for (const day of inMonth) {
        if (dayTotal(day) > 0) active++
        for (const category of CATEGORY_ORDER) {
            if ((day.counts[category] || 0) > 0) categoryDays[category]++
        }
    }
    return { active, categoryDays }
}

export default function MonthSummary({ days }: { days: ActivityDay[] }) {
    const data = useMemo(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const prev = new Date(year, month - 1, 1)
        const current = monthStats(days, year, month)
        const previous = monthStats(days, prev.getFullYear(), prev.getMonth())
        const change = previous.active > 0 ? Math.round(((current.active - previous.active) / previous.active) * 100) : null

        return {
            title: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
            prevName: prev.toLocaleString("en-US", { month: "long" }),
            totalDays: new Date(year, month + 1, 0).getDate(),
            change,
            ...current,
        }
    }, [days])

    const up = (data.change ?? 0) >= 0

    return (
        <section aria-labelledby="month-summary-title" className="rounded-xl border border-[#D5EEDF] bg-[#F1FAF4] p-4">
            <div className="flex items-center gap-2">
                <CalendarDays size={17} className="text-[#2F9A67]" aria-hidden="true" />
                <h2 id="month-summary-title" className="text-[14px] font-semibold text-[#18181B]">
                    {data.title}
                </h2>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[#18181B]">
                        <span className="text-[30px] font-bold leading-none tracking-[-0.03em]">{data.active}</span>
                        <span className="ml-1.5 text-[20px] text-[#4B5563]">/ {data.totalDays}</span>
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-medium text-[#2F9A67]">active days</p>
                </div>
                {data.change !== null ? (
                    <div className="text-right">
                        <span
                            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
                                up ? "bg-[#DDF3E6] text-[#23875A]" : "bg-[#FDE8E8] text-[#B42318]"
                            }`}
                        >
                            {up ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />}
                            {Math.abs(data.change)}%
                        </span>
                        <p className="mt-1 text-[11px] text-[#6B7280]">vs. {data.prevName}</p>
                    </div>
                ) : null}
            </div>

            <ul className="mt-4 space-y-0.5 rounded-lg bg-white p-2">
                {CATEGORY_ORDER.map((category) => (
                    <li key={category} className="flex items-center justify-between px-1.5 py-1.5 text-[13px]">
                        <span className="inline-flex items-center gap-2.5 text-[#18181B]">
                            <span className="h-3 w-3 rounded-[3px]" style={{ background: CATEGORY_META[category].color }} />
                            {CATEGORY_META[category].label}
                        </span>
                        <span className="text-[#6B7280]">
                            {data.categoryDays[category]} {data.categoryDays[category] === 1 ? "day" : "days"}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}
