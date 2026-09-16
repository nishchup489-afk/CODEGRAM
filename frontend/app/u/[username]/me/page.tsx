"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import api from "@/app/_lib/api"
import useCurrentUser from "@/app/_lib/currentUser"
import type { UserFullProfile } from "@/app/_lib/type/profileAnalytics"

import ProfileHeader from "../components/ProfileHeader"
import {
    ProfileActivity,
    ProfileOverview,
    ProfileProjects,
    ProfileTabIcon,
} from "./components/ProfileSections"

type ProfileTab = "overview" | "projects" | "activity"

const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "activity", label: "Activity" },
]

export default function ProfilePage() {
    const params = useParams<{ username: string }>()
    const username = params.username
    const [activeTab, setActiveTab] = useState<ProfileTab>("overview")
    const [profileData, setProfileData] = useState<UserFullProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const { currentUser } = useCurrentUser()

    useEffect(() => {
        if (!username) return

        const controller = new AbortController()

        async function getProfile() {
            try {
                setLoading(true)
                setError("")

                const response = await api.get<UserFullProfile>(
                    `/projects/${username}/full-profile`,
                    { signal: controller.signal },
                )

                setProfileData(response.data)
            } catch (requestError) {
                if (controller.signal.aborted) return
                console.error(requestError)
                setError("This developer profile could not be loaded.")
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        getProfile()
        return () => controller.abort()
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <ProfileHeader
                        profileData={{} as UserFullProfile}
                        loading
                    />
                    <div className="mt-5 h-14 animate-pulse rounded-lg border border-[#E5E7EB] bg-white" />
                    <div className="mt-5 h-72 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
                </div>
            </div>
        )
    }

    if (error || !profileData) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F9FA] px-5">
                <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-7 text-center">
                    <h1 className="text-xl font-semibold text-[#18181B]">Profile unavailable</h1>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        {error || "This developer profile does not exist or is private."}
                    </p>
                </div>
            </div>
        )
    }

    const isOwner = currentUser?.username?.toLowerCase() === profileData.username.toLowerCase()

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#18181B]">
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <ProfileHeader profileData={profileData} isOwner={isOwner} />

                <nav
                    aria-label="Profile sections"
                    className="mt-5 overflow-x-auto border-b border-[#E5E7EB] bg-[#F8F9FA]"
                >
                    <div className="flex min-w-max gap-7" role="tablist">
                        {tabs.map((tab) => {
                            const selected = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`profile-${tab.id}-panel`}
                                    id={`profile-${tab.id}-tab`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative inline-flex h-12 items-center gap-2 px-1 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E8560A] ${
                                        selected
                                            ? "text-[#C2410C]"
                                            : "text-[#6B7280] hover:text-[#18181B]"
                                    }`}
                                >
                                    <ProfileTabIcon tab={tab.id} />
                                    {tab.label}
                                    {selected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E8560A]" /> : null}
                                </button>
                            )
                        })}
                    </div>
                </nav>

                <div
                    className="mt-5"
                    role="tabpanel"
                    id={`profile-${activeTab}-panel`}
                    aria-labelledby={`profile-${activeTab}-tab`}
                >
                    {activeTab === "overview" ? <ProfileOverview profile={profileData} isOwner={isOwner} /> : null}
                    {activeTab === "projects" ? <ProfileProjects profile={profileData} /> : null}
                    {activeTab === "activity" ? <ProfileActivity profile={profileData} /> : null}
                </div>
            </div>
        </div>
    )
}
