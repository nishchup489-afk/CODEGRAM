"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    CalendarDays,
    Github,
    Globe2,
    Linkedin,
    Mail,
    MapPin,
    Pencil,
    User,
    X,
} from "lucide-react"

import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"

type ProfileHeaderProps = {
    profileData: UserFullProfile
    loading?: boolean
    error?: string
    isOwner?: boolean
}

function externalUrl(url: string) {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

function joinedLabel(value?: string) {
    if (!value) return null
    if (/^joined\s/i.test(value)) return value

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return `Joined ${new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
    }).format(date)}`
}

export default function ProfileHeader({
    profileData,
    loading = false,
    error = "",
    isOwner = false,
}: ProfileHeaderProps) {
    const [viewer, setViewer] = useState<"avatar" | "banner" | null>(null)

    useEffect(() => {
        if (!viewer) return

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setViewer(null)
        }

        document.addEventListener("keydown", closeOnEscape)
        return () => document.removeEventListener("keydown", closeOnEscape)
    }, [viewer])

    if (loading) {
        return (
            <div className="animate-pulse overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                <div className="h-36 bg-[#F3F4F6] sm:h-44" />
                <div className="px-5 pb-6 sm:px-7">
                    <div className="-mt-12 h-24 w-24 rounded-full border-4 border-white bg-[#E5E7EB]" />
                    <div className="mt-4 h-7 w-52 rounded bg-[#E5E7EB]" />
                    <div className="mt-3 h-4 w-full max-w-md rounded bg-[#F3F4F6]" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
            </div>
        )
    }

    const displayName = profileData.display_name || profileData.username
    const joined = joinedLabel(profileData.joined_date)
    const projectCount = profileData.projects?.length ?? profileData.project_count ?? 0
    const links = [
        profileData.github_url
            ? { label: "GitHub", href: externalUrl(profileData.github_url), icon: Github }
            : null,
        profileData.linkedin_url
            ? { label: "LinkedIn", href: externalUrl(profileData.linkedin_url), icon: Linkedin }
            : null,
        profileData.portfolio_url
            ? { label: "Portfolio", href: externalUrl(profileData.portfolio_url), icon: Globe2 }
            : null,
        profileData.email
            ? { label: "Email", href: `mailto:${profileData.email}`, icon: Mail }
            : null,
    ].filter((link): link is NonNullable<typeof link> => Boolean(link))

    return (
        <>
            <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {profileData.banner_url ? (
                    <button
                        type="button"
                        onClick={() => setViewer("banner")}
                        className="relative block h-36 w-full overflow-hidden bg-[#FFF7ED] text-left sm:h-44"
                        aria-label={`View ${displayName}'s banner`}
                    >
                        <Image
                            src={profileData.banner_url}
                            alt={`${displayName}'s profile banner`}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 960px"
                            className="object-cover"
                        />
                        <span className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent" />
                    </button>
                ) : (
                    <div className="relative h-36 overflow-hidden bg-[#FFF7ED] sm:h-44" aria-hidden="true">
                        <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-orange-200/55 blur-3xl" />
                        <div className="absolute -bottom-20 left-1/4 h-48 w-96 rounded-full bg-amber-100/70 blur-3xl" />
                    </div>
                )}

                <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                    <div className="flex items-end justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => profileData.avatar_url && setViewer("avatar")}
                            className="relative -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#F3F4F6] shadow-[0_8px_24px_rgba(17,24,39,0.12)] sm:-mt-14 sm:h-28 sm:w-28"
                            aria-label={profileData.avatar_url ? `View ${displayName}'s avatar` : undefined}
                            disabled={!profileData.avatar_url}
                        >
                            {profileData.avatar_url ? (
                                <Image
                                    src={profileData.avatar_url}
                                    alt={`${displayName}'s avatar`}
                                    fill
                                    sizes="112px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
                                    <User size={30} aria-hidden="true" />
                                </span>
                            )}
                        </button>

                        {isOwner ? (
                            <Link
                                href={`/u/${profileData.username}/profile/edit`}
                                className="mb-1 inline-flex h-10 items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#374151] transition hover:border-orange-200 hover:bg-[#FFF7ED] hover:text-[#C2410C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                            >
                                <Pencil size={15} aria-hidden="true" />
                                Edit profile
                            </Link>
                        ) : null}
                    </div>

                    <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#18181B] sm:text-3xl">
                                    {displayName}
                                </h1>
                                <span className="text-sm text-[#6B7280]">@{profileData.username}</span>
                            </div>

                            {profileData.current_build ? (
                                <p className="mt-2 text-sm font-medium text-[#374151]">
                                    Current focus · {profileData.current_build}
                                </p>
                            ) : null}

                            {profileData.bio ? (
                                <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[#4B5563]">
                                    {profileData.bio}
                                </p>
                            ) : null}

                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                                {profileData.location ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={14} aria-hidden="true" />
                                        {profileData.location}
                                    </span>
                                ) : null}
                                {joined ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays size={14} aria-hidden="true" />
                                        {joined}
                                    </span>
                                ) : null}
                            </div>

                            {links.length ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {links.map(({ label, href, icon: Icon }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target={href.startsWith("mailto:") ? undefined : "_blank"}
                                            rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#4B5563] transition hover:border-orange-200 hover:bg-[#FFF7ED] hover:text-[#C2410C]"
                                        >
                                            <Icon size={15} aria-hidden="true" />
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <dl className="grid grid-cols-3 gap-5 border-t border-[#E5E7EB] pt-4 text-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                            <div>
                                <dt className="text-xs text-[#6B7280]">Projects</dt>
                                <dd className="mt-1 text-lg font-semibold text-[#18181B]">{projectCount}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#6B7280]">Followers</dt>
                                <dd className="mt-1 text-lg font-semibold text-[#18181B]">{profileData.followers_count}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#6B7280]">Following</dt>
                                <dd className="mt-1 text-lg font-semibold text-[#18181B]">{profileData.following_count}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {viewer ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={viewer === "avatar" ? "Profile avatar" : "Profile banner"}
                    className="fixed inset-0 z-999 flex items-center justify-center bg-[#18181B]/75 p-5 backdrop-blur-sm"
                    onClick={() => setViewer(null)}
                >
                    <button
                        type="button"
                        aria-label="Close image viewer"
                        onClick={() => setViewer(null)}
                        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-lg border border-white/20 bg-black/30 text-white"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                    <div
                        className={viewer === "avatar" ? "relative aspect-square w-[min(82vw,560px)]" : "relative h-[min(72vh,720px)] w-[min(92vw,1200px)]"}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <Image
                            src={viewer === "avatar" ? profileData.avatar_url! : profileData.banner_url!}
                            alt={viewer === "avatar" ? `${displayName}'s avatar` : `${displayName}'s profile banner`}
                            fill
                            sizes="92vw"
                            className="object-contain"
                        />
                    </div>
                </div>
            ) : null}
        </>
    )
}
