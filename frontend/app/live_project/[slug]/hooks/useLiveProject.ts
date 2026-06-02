"use client"

import { useEffect, useState } from "react"

import type {
    GetLiveProject,
    GetLiveProjectJournal,
} from "../types/liveProject"



interface UseLiveProjectProps {

    slug: string

}



export default function useLiveProject({

    slug,

}: UseLiveProjectProps) {



    const [project, setProject] =
        useState<GetLiveProject | null>(
            null
        )



    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>(
            []
        )



    const [loading, setLoading] =
        useState(true)



    const [error, setError] =
        useState("")



    async function fetchProject() {

        try {

            setLoading(true)

            setError("")



            /*
                Replace later with real API call
            */



            await new Promise((resolve) =>
                setTimeout(resolve, 1200)
            )



            const mockProject:
                GetLiveProject = {

                id:
                    crypto.randomUUID(),

                title:
                    "DevManiac Live Console",

                slug,

                goal:
                    "Building the next generation developer social platform with live project journals.",

                description:
                    "A real-time developer build journey system inspired by commits, devlogs, and public engineering progress tracking.",

                github_url:
                    "https://github.com/DevManiac/project",

                live_url:
                    "https://DevManiac.dev",

                demo_video_url:
                    "",

                progress_percentage:
                    34,

                current_goal:
                    "Finish live journal timeline architecture",

                current_status:
                    "Refactoring frontend systems",

                status:
                    "active",

                is_public: true,

                views_count: 2834,

                journal_count: 4,

                tech_stack: [

                    "Next.js",

                    "FastAPI",

                    "PostgreSQL",

                    "TypeScript",

                    "TailwindCSS",

                    "GSAP",

                ],

                created_at:
                    new Date(
                        Date.now() -
                        1000 *
                        60 *
                        60 *
                        24 *
                        12
                    ).toISOString(),

            }



            const mockJournals:
                GetLiveProjectJournal[] = [

                {
                    id:
                        crypto.randomUUID(),

                    day_number: 1,

                    entry_type:
                        "architecture",

                    content:
                        "Started architecting the live journal system. The goal is to transform project building into a public developer journey instead of static portfolios.",

                    progress_percentage:
                        8,

                    code_snippets: [
                        {
                            language:
                                "tsx",

                            code:
`export default function Journal() {
    return <div>Live Build</div>
}`,
                        }
                    ],

                    problem_solutions: [
                        {
                            problem:
                                "The page became a giant monolithic component.",

                            solution:
                                "Split the entire feature into isolated systems and reusable components.",
                        }
                    ],

                    media_urls: [],

                    likes_count: 12,

                    comments_count: 3,

                    created_at:
                        new Date(
                            Date.now() -
                            1000 *
                            60 *
                            60 *
                            24 *
                            10
                        ).toISOString(),

                },

                {
                    id:
                        crypto.randomUUID(),

                    day_number: 4,

                    entry_type:
                        "progress",

                    content:
                        "Built animated loading/error states using GSAP. The experience now feels like an actual futuristic build console.",

                    progress_percentage:
                        18,

                    code_snippets: [],

                    problem_solutions: [],

                    media_urls: [],

                    likes_count: 25,

                    comments_count: 7,

                    created_at:
                        new Date(
                            Date.now() -
                            1000 *
                            60 *
                            60 *
                            24 *
                            6
                        ).toISOString(),

                },

            ]



            setProject(mockProject)

            setJournals(mockJournals)

        }

        catch (error) {

            console.error(error)

            setError(
                "Failed to load live project."
            )

        }

        finally {

            setLoading(false)

        }

    }



    useEffect(() => {

        if (!slug) return

        fetchProject()

    }, [slug])



    function addJournalEntry(
        entry: GetLiveProjectJournal
    ) {

        setJournals((prev) => [

            entry,

            ...prev,

        ])



        setProject((prev) => {

            if (!prev) return prev

            return {

                ...prev,

                progress_percentage:
                    entry.progress_percentage,

                journal_count:
                    prev.journal_count + 1,

            }

        })

    }



    function updateProject(
        data: Partial<GetLiveProject>
    ) {

        setProject((prev) => {

            if (!prev) return prev

            return {

                ...prev,

                ...data,

            }

        })

    }



    return {

        project,

        journals,



        loading,

        error,



        fetchProject,



        setProject,

        updateProject,



        setJournals,

        addJournalEntry,

    }

}