"use client"

import { useState } from "react"

import LiveProjectHero
from "./components/hero/LiveProjectHero"

import LiveProjectSetupPanel
from "./components/setup/LiveProjectSetupPanel"

import LatestCommitCard
from "./components/commit/LatestCommitCard"

import JournalSection
from "./components/journal/JournalSection"

import type {
    GetLiveProject,
    GetLiveProjectJournal
} from "./types/liveProject"



export default function GetLiveProjectPage() {



    const [project, setProject] =
        useState<GetLiveProject>({

            id: "",

            title: "DevManiac",

            slug: "DevManiac",

            goal:
                "A social platform where your build history becomes your portfolio.",

            description: "",

            github_url:
                "https://github.com/nish/DevManiac",

            live_url: "",

            demo_video_url: "",

            progress_percentage: 12,

            current_status: "",

            current_goal: "",

            status: "active",

            is_public: true,

            views_count: 248,

            journal_count: 3,

            tech_stack: [
                "Next.js",
                "FastAPI",
                "PostgreSQL",
                "Clerk"
            ],

            created_at:
                new Date().toISOString(),

        })



    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>([])



    const [composerOpen, setComposerOpen] =
        useState(false)



    function publishEntry(
        entry: GetLiveProjectJournal
    ) {

        setJournals((prev) => [
            entry,
            ...prev
        ])

        setProject((prev) => ({
            ...prev,

            progress_percentage:
                entry.progress_percentage,

            journal_count:
                prev.journal_count + 1,
        }))

        setComposerOpen(false)
    }



    return (

        <main
            className="
                min-h-screen
                bg-black
                px-4
                py-6
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-4xl
                    flex-col
                    gap-5
                "
            >

                <LiveProjectHero
                    project={project}
                />



                <LiveProjectSetupPanel
                    project={project}
                    setProject={setProject}
                />



                <LatestCommitCard
                    currentDay={4}
                    loggedToday={false}
                    onLog={() =>
                        setComposerOpen(true)
                    }
                />



                <JournalSection
                    project={project}
                    journals={journals}
                    composerOpen={composerOpen}
                    setComposerOpen={
                        setComposerOpen
                    }
                    onPublish={publishEntry}
                />

            </div>

        </main>
    )
}