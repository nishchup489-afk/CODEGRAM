"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"

import LiveProjectHero from "./components/hero/LiveProjectHero"
import LiveProjectSetupPanel from "./components/setup/LiveProjectSetupPanel"
import LatestCommitCard from "./components/commit/LatestCommitCard"
import JournalSection from "./components/journal/JournalSection"

import {
    GetLiveProject,
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"

const emptyProject: GetLiveProject = {
    id: "",
    user_id: "",
    user: {
        id: "",
        clerk_user_id: "",
        username: "",
        display_name: "",
        avatar_url: "",
    },
    title: "",
    slug: "",
    goal: "",
    description: "",
    github_url: "",
    live_url: "",
    demo_video_url: "",
    thumbnail_url: "",
    gallery_urls: [],
    tech_stack: [],
    progress_percentage: 0,
    current_status: "",
    current_goal: "",
    status: "active",
    category: "",
    is_public: true,
    is_featured: false,
    views_count: 0,
    journal_count: 0,
    days_count: 0,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

export default function GetLiveProjectPage() {
    const params = useParams()
    const slug = params.slug as string

    const { user, isLoaded } = useUser()

    const [project, setProject] =
        useState<GetLiveProject>(emptyProject)

    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>([])

    const [composerOpen, setComposerOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")

    useEffect(() => {
        if (!slug) return

        const getLiveProjectData = async () => {
            try {
                setLoading(true)
                setError("")

                const [projectRes, journalsRes] =
                    await Promise.all([
                        api.get(`/live-projects/${slug}`),
                        api.get(`/live-projects/${slug}/journals`),
                    ])

                setProject(projectRes.data)
                setJournals(journalsRes.data)

            } catch (err) {
                console.error(err)
                setError("There was a problem fetching live project data")
            } finally {
                setLoading(false)
            }
        }

        getLiveProjectData()
    }, [slug])

    async function publishEntry(data: {

        day_number: number

        content: string

        entry_type: string

        progress_percentage: number | null

        media_urls: string[]

        code_snippets: string[]

        problem_solutions: any[]

    }) {
        if (!isLoaded || !user?.id) return

        try {
            const res = await api.post(
                `/live-projects/${slug}/journals?clerk_user_id=${user.id}`,
                data
            )

            const newEntry = res.data as GetLiveProjectJournal

            setJournals((prev) => [
                newEntry,
                ...prev,
            ])

            setProject((prev) => ({
                ...prev,
                journal_count: prev.journal_count + 1,
                progress_percentage:
                    newEntry.progress_percentage ??
                    prev.progress_percentage,
            }))

            setComposerOpen(false)

        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
                Loading live project...
            </main>
        )
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black px-4 text-center text-red-400">
                {error}
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black px-4 py-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
                <LiveProjectHero project={project} />

                <LiveProjectSetupPanel
                    project={project}
                    setProject={setProject}
                    isOwner={true}
                    openEditModal={() => {}}
                />

                <LatestCommitCard
                    githubUrl={project.github_url}
                />

                <JournalSection
                    project={project}
                    journals={journals}
                    composerOpen={composerOpen}
                    setComposerOpen={setComposerOpen}
                    onPublish={publishEntry}
                />
            </div>
        </main>
    )
}