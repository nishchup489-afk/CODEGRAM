"use client"

import {
    Plus,
    BookOpen,
    Sparkles,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"

import JournalComposer
from "./JournalComposer"

import JournalEntryCard
from "./JournalEntryCard"

import type {
    GetLiveProject,
    GetLiveProjectJournal
} from "@/app/lib/type/liveproject"

type Props = {
    journals: GetLiveProjectJournal[]
    project: GetLiveProject
}



interface JournalSectionProps {

    project: GetLiveProject

    journals: GetLiveProjectJournal[]

    composerOpen: boolean

    setComposerOpen: (
        value: boolean
    ) => void

    onPublish: (
        entry: GetLiveProjectJournal
    ) => void

}



export default function JournalSection({

    project,

    journals,

    composerOpen,

    setComposerOpen,

    onPublish,

}: JournalSectionProps) {



    const currentDay =
        Math.max(
            1,
            Math.floor(
                (
                    Date.now() -
                    new Date(
                        project.created_at
                    ).getTime()
                ) /
                (1000 * 60 * 60 * 24)
            )
        )



    return (

        <section
            className="
                relative
                flex
                flex-col
                gap-6
            "
        >

            {/* HEADER */}

            <RevealWrapper delay={0.05}>

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-orange-300
                            "
                        >

                            <Sparkles size={14} />

                            Live Timeline

                        </div>



                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-tight
                                text-white
                            "
                        >
                            Build Journal
                        </h2>



                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-7
                                text-zinc-400
                            "
                        >
                            Every iteration, failure,
                            breakthrough, architecture shift,
                            and deployment lives here.
                        </p>

                    </div>



                    {/* NEW ENTRY */}

                    {!composerOpen && (

                        <button
                            onClick={() =>
                                setComposerOpen(true)
                            }
                            className="
                                flex
                                items-center
                                justify-center
                                gap-3
                                rounded-3xl
                                bg-orange-500
                                px-6
                                py-4
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                hover:scale-[1.02]
                                hover:bg-orange-400
                            "
                        >

                            <Plus size={18} />

                            New Journal Entry

                        </button>

                    )}

                </div>

            </RevealWrapper>



            {/* COMPOSER */}

            {composerOpen && (

                <JournalComposer
                    currentDay={currentDay}
                    baseProgress={
                        project.progress_percentage
                    }
                    onCancel={() =>
                        setComposerOpen(false)
                    }
                    onPublish={onPublish}
                />

            )}



            {/* EMPTY */}

            {!composerOpen &&
                journals.length === 0 && (

                <RevealWrapper delay={0.1}>

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[36px]
                            border
                            border-dashed
                            border-white/10
                            bg-[#0b0b0b]
                            px-8
                            py-20
                            text-center
                        "
                    >

                        {/* GLOW */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-60
                                w-60
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-orange-500/10
                                blur-3xl
                            "
                        />



                        <div className="relative z-10">

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-24
                                    w-24
                                    items-center
                                    justify-center
                                    rounded-[30px]
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    text-orange-300
                                "
                            >

                                <BookOpen size={40} />

                            </div>



                            <h3
                                className="
                                    mt-8
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                No Build Logs Yet
                            </h3>



                            <p
                                className="
                                    mx-auto
                                    mt-4
                                    max-w-xl
                                    text-sm
                                    leading-8
                                    text-zinc-400
                                "
                            >
                                Start documenting the journey.
                                Your architecture decisions,
                                struggles, experiments, fixes,
                                and breakthroughs become your
                                developer story.
                            </p>



                            <button
                                onClick={() =>
                                    setComposerOpen(true)
                                }
                                className="
                                    mt-8
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-3xl
                                    bg-orange-500
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    hover:scale-[1.02]
                                    hover:bg-orange-400
                                "
                            >

                                <Plus size={18} />

                                Create First Entry

                            </button>

                        </div>

                    </div>

                </RevealWrapper>

            )}



            {/* TIMELINE */}

            {journals.length > 0 && (

                <div
                    className="
                        relative
                        flex
                        flex-col
                        gap-8
                    "
                >

                    {/* LINE */}

                    <div
                        className="
                            absolute
                            left-5.75
                            top-0
                            hidden
                            h-full
                            w-0.5
                            bg-linear-to-b
                            from-orange-500/40
                            via-orange-500/10
                            to-transparent
                            md:block
                        "
                    />



                    {journals.map((entry) => (

                        <div
                            key={entry.id}
                            className="
                                relative
                                flex
                                gap-6
                            "
                        >

                            {/* NODE */}

                            <div
                                className="
                                    relative
                                    z-10
                                    hidden
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    text-orange-300
                                    backdrop-blur-xl
                                    md:flex
                                "
                            >

                                <Sparkles size={18} />

                            </div>



                            {/* CARD */}

                            <div className="flex-1">

                                <JournalEntryCard
                                    entry={entry}
                                />

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}