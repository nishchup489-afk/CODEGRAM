"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import api from "@/app/_lib/api"
import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"
import {
    EMPTY_PROFILE_ACTIVITY,
    EMPTY_PROFILE_EXTRAS,
    type ProfileActivity,
    type ProfileExtras,
} from "@/app/_lib/type/profileActivity"

import ProjectsPreview from "./components/ProjectPreview"
import LiveProjectsPreview from "./components/LiveProjectPreview"
import ProfileHero from "./components/overview/ProfileHero"
import DeveloperActivity from "./components/overview/DeveloperActivity"
import CurrentFocus from "./components/overview/CurrentFocus"
import FeaturedProjects from "./components/overview/FeaturedProjects"
import RecentActivity from "./components/overview/RecentActivity"
import MonthSummary from "./components/overview/MonthSummary"
import {
    ConnectShare,
    ConnectedSources,
    OpportunitiesCard,
    QuoteCard,
    SkillsCard,
} from "./components/overview/RailCards"

type Tab = "overview" | "projects" | "activity"

const TABS: { id: Tab | "writing"; label: string; soon?: boolean }[] = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "activity", label: "Activity" },
    { id: "writing", label: "Writing", soon: true },
]

export default function Profile() {
    const params = useParams()
    const username = params.username as string
    const { user, isLoaded } = useUser()

    const [activeTab, setActiveTab] = useState<Tab>("overview")
    const [profile, setProfile] = useState<UserFullProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // TODO: replace with the activity endpoint once it exists.
    const [activity] = useState<ProfileActivity>(EMPTY_PROFILE_ACTIVITY)
    // TODO: headline, quote, learning, twitter and opportunities aren't on the user model yet.
    const [extras] = useState<ProfileExtras>(EMPTY_PROFILE_EXTRAS)

    useEffect(() => {
        if (!username) return
        let cancelled = false

        async function load() {
            try {
                setLoading(true)
                const response = await api.get(`/projects/${username}/full-profile`)
                if (!cancelled) setProfile(response.data)
            } catch (err) {
                console.error(err)
                if (!cancelled) setProfile(null)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [username])

    const isFounder = useMemo(() => {
        const ids = process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? []
        return profile ? ids.includes(profile.clerk_user_id) : false
    }, [profile])

    if (!username) return null
    if (loading || !isLoaded) return <ProfileSkeleton />

    if (!profile) {
        return (
            <div className="grid min-h-[70vh] place-items-center bg-[#FAFBFC] px-4 text-center">
                <div>
                    <h1 className="text-xl font-semibold text-[#18181B]">User not found</h1>
                    <p className="mt-2 text-sm text-[#6B7280]">We couldn&apos;t find @{username}.</p>
                </div>
            </div>
        )
    }

    const isOwner = user?.id === profile.clerk_user_id
    const name = profile.display_name || profile.username

    const rail = (
        <>
            <MonthSummary days={activity.days} />
            {extras.quote ? <QuoteCard quote={extras.quote} author={name} /> : null}
            <SkillsCard profile={profile} isOwner={isOwner} />
            <ConnectedSources githubUrl={profile.github_url} importedDays={activity.github_imported_days} isOwner={isOwner} />
            {extras.open_to_opportunities ? (
                <OpportunitiesCard note={extras.opportunities_note} email={isOwner ? null : profile.email} />
            ) : null}
        </>
    )

    return (
        <div className="min-h-screen bg-[#FAFBFC]">
            <div className="mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-6 lg:py-6">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
                    <ProfileHero profile={profile} headline={extras.headline} isOwner={isOwner} isFounder={isFounder} />
                    <div className="xl:self-start">
                        <ConnectShare profile={profile} twitterUrl={extras.twitter_url} isOwner={isOwner} />
                    </div>
                </div>

                <div role="tablist" aria-label="Profile sections" className="mt-5 flex overflow-x-auto border-b border-[#E5E7EB]">
                    {TABS.map((tab) => {
                        const active = tab.id === activeTab
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                disabled={tab.soon}
                                onClick={() => !tab.soon && setActiveTab(tab.id as Tab)}
                                className={`relative inline-flex shrink-0 items-center gap-2 px-4 py-3 text-[13.5px] font-medium transition-colors first:pl-4 ${
                                    active ? "text-[#E8560A]" : tab.soon ? "cursor-default text-[#6B7280]" : "text-[#6B7280] hover:text-[#18181B]"
                                }`}
                            >
                                {tab.label}
                                {tab.soon ? (
                                    <span className="rounded-md bg-[#F3F4F6] px-1.5 py-0.5 text-[10.5px] font-medium text-[#6B7280]">Soon</span>
                                ) : null}
                                {active ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#E8560A]" /> : null}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
                    <div className="min-w-0 space-y-5">
                        {activeTab === "overview" ? (
                            <>
                                <DeveloperActivity days={activity.days} />
                                <CurrentFocus profile={profile} learning={extras.learning} />
                                <FeaturedProjects profile={profile} isOwner={isOwner} onViewAll={() => setActiveTab("projects")} />
                                <RecentActivity items={activity.recent} limit={5} onViewAll={() => setActiveTab("activity")} />
                            </>
                        ) : null}

                        {activeTab === "projects" ? (
                            <>
                                <ProjectsPreview profile={profile} />
                                <LiveProjectsPreview profile={profile} />
                            </>
                        ) : null}

                        {activeTab === "activity" ? (
                            <>
                                <DeveloperActivity days={activity.days} />
                                <RecentActivity items={activity.recent} />
                            </>
                        ) : null}
                    </div>

                    <aside aria-label="Profile summary" className="space-y-5">
                        {rail}
                    </aside>
                </div>
            </div>
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#FAFBFC]" aria-busy="true" aria-label="Loading profile">
            <div className="mx-auto w-full max-w-[1240px] animate-pulse px-4 py-5 sm:px-6 lg:py-6">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
                    <div className="h-72 rounded-xl border border-[#E8EAEE] bg-white" />
                    <div className="h-72 rounded-xl border border-[#E8EAEE] bg-white" />
                </div>
                <div className="mt-5 h-11 border-b border-[#E5E7EB]" />
                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
                    <div className="h-64 rounded-xl border border-[#E8EAEE] bg-white" />
                    <div className="h-64 rounded-xl border border-[#E8EAEE] bg-[#F1FAF4]" />
                </div>
            </div>
        </div>
    )
}
