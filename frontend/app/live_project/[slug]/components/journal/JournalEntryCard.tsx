"use client"

import {
    Clock,
    Heart,
    MessageCircle,
    Flame,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"

import CodeSnippetBlock
from "./CodeSnippetBlock"

import EntryReactionBar
from "./EntryReactionBar"

import type {
    GetLiveProjectJournal
} from "../../types/liveProject"



interface JournalEntryCardProps {

    entry: GetLiveProjectJournal

}



const ENTRY_STYLES = {

    progress: {
        color:
            "text-orange-300",
        bg:
            "bg-orange-500/10",
        border:
            "border-orange-500/20",
    },

    milestone: {
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    bugfix: {
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    deployment: {
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    architecture: {
        color:
            "text-purple-300",
        bg:
            "bg-purple-500/10",
        border:
            "border-purple-500/20",
    },

    announcement: {
        color:
            "text-pink-300",
        bg:
            "bg-pink-500/10",
        border:
            "border-pink-500/20",
    },

    failure: {
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

}



export default function JournalEntryCard({

    entry,

}: JournalEntryCardProps) {



    const style =
        ENTRY_STYLES[
            entry.entry_type as keyof typeof ENTRY_STYLES
        ] || ENTRY_STYLES.progress



    return (

        <RevealWrapper>

            <article
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-[#0b0b0b]
                    p-6
                    md:p-8
                "
            >

                {/* GLOW */}

                <div
                    className={`
                        absolute
                        -right-25
                        -top-25
                        h-65
                        w-65
                        rounded-full
                        blur-3xl
                        opacity-60
                        ${style.bg}
                    `}
                />



                {/* GRID */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.03]
                        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                        bg-size-[60px_60px]
                    "
                />



                <div className="relative z-10">

                    {/* TOP */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-start
                            md:justify-between
                        "
                    >

                        <div>

                            {/* TYPE */}

                            <div
                                className={`
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    ${style.border}
                                    ${style.bg}
                                    ${style.color}
                                `}
                            >

                                <Flame size={14} />

                                {entry.entry_type}

                            </div>



                            {/* DAY */}

                            <h2
                                className="
                                    mt-5
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                Day {entry.day_number}
                            </h2>



                            {/* TIME */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-zinc-500
                                "
                            >

                                <Clock size={16} />

                                {new Date(
                                    entry.created_at
                                ).toLocaleString()}

                            </div>

                        </div>



                        {/* PROGRESS */}

                        <div
                            className="
                                rounded-[28px]
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-6
                                py-5
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-orange-300
                                "
                            >
                                Progress
                            </p>



                            <h3
                                className="
                                    mt-2
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {
                                    entry.progress_percentage
                                }
                                %
                            </h3>

                        </div>

                    </div>



                    {/* CONTENT */}

                    <div className="mt-8">

                        <p
                            className="
                                whitespace-pre-wrap
                                text-base
                                leading-9
                                text-zinc-300
                            "
                        >
                            {entry.content}
                        </p>

                    </div>



                    {/* CODE SNIPPETS */}

                    {entry.code_snippets &&
                        entry.code_snippets.length > 0 && (

                        <div className="mt-10 space-y-6">

                            {entry.code_snippets.map(
                                (
                                    snippet,
                                    index
                                ) => (

                                    <CodeSnippetBlock
                                        key={index}
                                        language={
                                            snippet.language
                                        }
                                        code={
                                            snippet.code
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}



                    {/* PROBLEMS */}

                    {entry.problem_solutions &&
                        entry.problem_solutions.length > 0 && (

                        <div className="mt-10 space-y-5">

                            {entry.problem_solutions.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="
                                            rounded-[28px]
                                            border
                                            border-white/10
                                            bg-white/3
                                            p-6
                                        "
                                    >

                                        <div
                                            className="
                                                grid
                                                gap-6
                                                lg:grid-cols-2
                                            "
                                        >

                                            {/* PROBLEM */}

                                            <div>

                                                <div
                                                    className="
                                                        mb-3
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        border-red-500/20
                                                        bg-red-500/10
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.25em]
                                                        text-red-300
                                                    "
                                                >
                                                    Problem
                                                </div>



                                                <p
                                                    className="
                                                        text-sm
                                                        leading-7
                                                        text-zinc-400
                                                    "
                                                >
                                                    {item.problem}
                                                </p>

                                            </div>



                                            {/* SOLUTION */}

                                            <div>

                                                <div
                                                    className="
                                                        mb-3
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        border-emerald-500/20
                                                        bg-emerald-500/10
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.25em]
                                                        text-emerald-300
                                                    "
                                                >
                                                    Solution
                                                </div>



                                                <p
                                                    className="
                                                        text-sm
                                                        leading-7
                                                        text-zinc-400
                                                    "
                                                >
                                                    {item.solution}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}



                    {/* MEDIA */}

                    {entry.media_urls &&
                        entry.media_urls.length > 0 && (

                        <div
                            className="
                                mt-10
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                            "
                        >

                            {entry.media_urls.map(
                                (url, index) => (

                                    <div
                                        key={index}
                                        className="
                                            overflow-hidden
                                            rounded-[28px]
                                            border
                                            border-white/10
                                            bg-black/30
                                        "
                                    >

                                        <img
                                            src={url}
                                            alt="journal media"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition-transform
                                                duration-500
                                                group-hover:scale-[1.03]
                                            "
                                        />

                                    </div>

                                )
                            )}

                        </div>

                    )}



                    {/* FOOTER */}

                    <div className="mt-10">

                        <EntryReactionBar
                            likes_count={
                                entry.likes_count
                            }
                            comments_count={
                                entry.comments_count
                            }
                        />

                    </div>

                </div>

            </article>

        </RevealWrapper>
    )
}