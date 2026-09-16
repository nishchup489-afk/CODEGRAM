"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Archive, CalendarDays, Check, EllipsisVertical, Hammer, Link2, MapPin, User } from "lucide-react"

import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"
import { Card, externalUrl, hostFromUrl } from "./shared"

type Props = {
    profile: UserFullProfile
    headline: string | null
    isOwner: boolean
    isFounder: boolean
}

export default function ProfileHero({ profile, headline, isOwner, isFounder }: Props) {
    const name = profile.display_name || profile.username

    return (
        <Card className="overflow-hidden">
            <div className="relative h-28 w-full bg-linear-to-r from-[#2A0B0B] via-[#7A1717] to-[#2A0B0B] sm:h-32">
                {profile.banner_url ? (
                    <Image src={profile.banner_url} alt="" fill priority sizes="(min-width: 1280px) 900px, 100vw" className="object-cover" />
                ) : null}
            </div>

            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#F3F4F6] shadow-[0_4px_14px_rgba(16,24,40,0.12)] sm:-mt-14 sm:h-[104px] sm:w-[104px]">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt={`${name}'s avatar`} fill sizes="104px" className="object-cover" />
                        ) : (
                            <span className="grid h-full w-full place-items-center text-[#9CA3AF]">
                                <User size={32} aria-hidden="true" />
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1 sm:pt-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="break-words text-2xl font-bold tracking-[-0.025em] text-[#18181B] sm:text-[26px]">
                                    {name}
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="text-[13px] text-[#6B7280]">@{profile.username}</span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF1E8] px-1.5 py-0.5 text-[11px] font-medium text-[#D9570F]">
                                        <Hammer size={11} aria-hidden="true" />
                                        {isFounder ? "Founder" : "Builder"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {isOwner ? (
                                    <Link
                                        href={`/u/${profile.username}/profile/edit`}
                                        className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-[13px] font-medium text-[#18181B] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                                    >
                                        Edit Profile
                                    </Link>
                                ) : null}
                                <MoreMenu username={profile.username} isOwner={isOwner} />
                            </div>
                        </div>

                        {headline ? <p className="mt-3 text-[13.5px] text-[#4B5563]">{headline}</p> : null}

                        <p className="mt-3 max-w-2xl whitespace-pre-line text-[13.5px] leading-6 text-[#4B5563]">
                            {profile.bio || (isOwner ? "Add a short bio so people know what you build." : "No bio yet.")}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#6B7280]">
                            {profile.location ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={13} aria-hidden="true" />
                                    {profile.location}
                                </span>
                            ) : null}
                            {profile.joined_date ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={13} aria-hidden="true" />
                                    {profile.joined_date}
                                </span>
                            ) : null}
                            {profile.portfolio_url ? (
                                <a
                                    href={externalUrl(profile.portfolio_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#2563EB] hover:underline"
                                >
                                    <Link2 size={13} aria-hidden="true" className="text-[#6B7280]" />
                                    {hostFromUrl(profile.portfolio_url)}
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function MoreMenu({ username, isOwner }: { username: string; isOwner: boolean }) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const close = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false)
        }
        const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
        document.addEventListener("mousedown", close)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("mousedown", close)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/u/${username}/me`)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            /* clipboard unavailable */
        }
    }

    const itemClass = "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] text-[#374151] hover:bg-[#F3F4F6]"

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
            >
                <EllipsisVertical size={16} aria-hidden="true" />
            </button>
            {open ? (
                <div role="menu" className="absolute right-0 top-11 z-20 w-48 rounded-lg border border-[#E5E7EB] bg-white p-1 shadow-[0_12px_32px_rgba(16,24,40,0.12)]">
                    <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
                        {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
                        {copied ? "Link copied" : "Copy profile link"}
                    </button>
                    {isOwner ? (
                        <Link href="/profile/archive" role="menuitem" className={itemClass}>
                            <Archive size={14} aria-hidden="true" />
                            View archive
                        </Link>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}
