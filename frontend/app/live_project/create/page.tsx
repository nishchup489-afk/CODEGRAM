"use client"

import { useEffect, useState } from "react"

import { useParams, useRouter } from "next/navigation"


import {
    Github,
    Globe,
    CalendarDays,
    Eye,
    BookOpen,
    ArrowLeft,
} from "lucide-react"

import api from "@/app/lib/api"
import type {
    GetLiveProject,
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"
import LiveProjectHero from "../[slug]/components/hero/LiveProjectHero"
import JournalSection from "../[slug]/components/journal/JournalSection"
import LiveProjectSetupPanel from "../[slug]/components/setup/LiveProjectSetupPanel"
import LatestCommitCard from "../[slug]/components/commit/LatestCommitCard"





export default function Page() {

    const params = useParams()

    const router = useRouter()

    const slug = params.slug as string


    const [project, setProject] =
        useState<GetLiveProject | null>(null)

    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")
    
    const [composerOpen, setComposerOpen] =
    useState(false)


    useEffect(() => {

        if (!slug) return

        const fetchLiveProject = async () => {

            try {

                setLoading(true)

                setError("")


                const [
                    projectRes,
                    journalsRes,
                ] = await Promise.all([

                    api.get(
                        `/live-projects/${slug}`
                    ),

                    api.get(
                        `/live-projects/${slug}/journals`
                    ),

                ])


                setProject(projectRes.data)

                setJournals(journalsRes.data)

            }

            catch (err: any) {

                console.error(err)

                setError(
                    err?.response?.data?.detail ||
                    "Failed to load live project"
                )

            }

            finally {

                setLoading(false)

            }

        }

        fetchLiveProject()

    }, [slug])


    const handlePublish = (
        entry: GetLiveProjectJournal
    ) => {

        setJournals((prev) => [
            entry,
            ...prev,
        ])

        setComposerOpen(false)

    }


    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-400">

                Loading live project...

            </div>

        )

    }



    if (error || !project) {

        return (

            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center">

                <p className="text-lg text-red-400">

                    {error}

                </p>

                <button
                    onClick={() => router.back()}
                    className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-300 transition hover:border-orange-500 hover:text-orange-400"
                >
                    Go Back
                </button>

            </div>

        )

    }



    return (

        <main className="min-h-screen bg-[#0a0a0a] text-white">

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">


                {/* BACK BUTTON */}

                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-orange-400"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>



                {/* HERO */}

                <LiveProjectHero
                    project={project}
                />



                {/* MAIN GRID */}

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">


                    {/* LEFT SIDE */}

                    <div className="space-y-8">


                        {/* ABOUT */}

                        <section className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

                            <h2 className="mb-5 text-xl font-semibold">

                                About Project

                            </h2>

                            <p className="whitespace-pre-wrap leading-8 text-zinc-400">

                                {project.description ||
                                    "No description added yet."}

                            </p>

                        </section>



                        {/* CURRENT STATUS */}

                        {(project.current_status ||
                            project.current_goal) && (

                            <section className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

                                <h2 className="mb-5 text-xl font-semibold">

                                    Current Build Status

                                </h2>

                                <div className="space-y-5">

                                    {project.current_status && (

                                        <div>

                                            <p className="mb-2 text-sm text-zinc-500">

                                                Current Status

                                            </p>

                                            <p className="leading-7 text-zinc-300">

                                                {project.current_status}

                                            </p>

                                        </div>

                                    )}

                                    {project.current_goal && (

                                        <div>

                                            <p className="mb-2 text-sm text-zinc-500">

                                                Current Goal

                                            </p>

                                            <p className="leading-7 text-zinc-300">

                                                {project.current_goal}

                                            </p>

                                        </div>

                                    )}

                                </div>

                            </section>

                        )}



                        {/* JOURNALS */}

                    <JournalSection
                        journals={journals}
                        project={project}
                        composerOpen={composerOpen}
                        setComposerOpen={setComposerOpen}
                        onPublish={handlePublish}
                    />

                    </div>



                    {/* RIGHT SIDEBAR */}

                    <aside className="space-y-6">


                        {/* PROJECT CONSOLE */}

                    <LiveProjectSetupPanel
                        project={project}
                        setProject={setProject}
                        isOwner={false}
                        openEditModal={() => {}}
                    />


                        {/* QUICK STATS */}

                        <section className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

                            <h2 className="mb-5 text-lg font-semibold">

                                Project Stats

                            </h2>

                            <div className="space-y-4">


                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2 text-zinc-400">

                                        <CalendarDays size={16} />

                                        <span>Day Count</span>

                                    </div>

                                    <span className="font-medium">

                                        Day {project.days_count}

                                    </span>

                                </div>


                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2 text-zinc-400">

                                        <Eye size={16} />

                                        <span>Views</span>

                                    </div>

                                    <span className="font-medium">

                                        {project.views_count}

                                    </span>

                                </div>


                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2 text-zinc-400">

                                        <BookOpen size={16} />

                                        <span>Journal Entries</span>

                                    </div>

                                    <span className="font-medium">

                                        {project.journal_count}

                                    </span>

                                </div>

                            </div>

                        </section>



                        {/* TECH STACK */}

                        <section className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

                            <h2 className="mb-5 text-lg font-semibold">

                                Tech Stack

                            </h2>

                            <div className="flex flex-wrap gap-2">

                                {project.tech_stack.length > 0 ? (

                                    project.tech_stack.map((tech) => (

                                        <span
                                            key={tech}
                                            className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300"
                                        >
                                            {tech}
                                        </span>

                                    ))

                                ) : (

                                    <p className="text-sm text-zinc-500">

                                        No tech stack added.

                                    </p>

                                )}

                            </div>

                        </section>



                        {/* LINKS */}

                        {(project.github_url ||
                            project.live_url) && (

                            <section className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

                                <h2 className="mb-5 text-lg font-semibold">

                                    Links

                                </h2>

                                <div className="flex flex-col gap-3">


                                    {project.github_url && (

                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm transition hover:border-orange-500 hover:bg-orange-500/10"
                                        >
                                            <Github size={16} />

                                            GitHub Repository
                                        </a>

                                    )}


                                    {project.live_url && (

                                        <a
                                            href={project.live_url}
                                            target="_blank"
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
                                        >
                                            <Globe size={16} />

                                            Live Demo
                                        </a>

                                    )}

                                </div>

                            </section>

                        )}



                        {/* COMMIT CARD */}

                        <LatestCommitCard
                            githubUrl={project.github_url}
                        />

                    </aside>

                </div>

            </div>

        </main>

    )

}