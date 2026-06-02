"use client"

import {
    AlertTriangle,
    CheckCircle2,
    Code2,
    TrendingUp,
} from "lucide-react"

import {
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"

interface JournalEntryCardProps {

    journal: GetLiveProjectJournal

}

export default function JournalEntryCard({

    journal,

}: JournalEntryCardProps) {

    return (

        <article
            className="
                overflow-hidden
                rounded-4xl
                border
                border-white/10
                bg-[#0f0f13]
            "
        >

            <div className="p-6">

                {/* HEADER */}

                <div
                    className="
                        mb-6
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-4
                                py-2
                                text-xs
                                font-bold
                                tracking-wide
                                text-orange-300
                            "
                        >

                            DAY {journal.day_number}

                        </div>


                        <div
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                bg-zinc-900
                                px-4
                                py-2
                                text-xs
                                font-medium
                                capitalize
                                text-zinc-400
                            "
                        >

                            {journal.entry_type}

                        </div>

                    </div>



                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-500/20
                            bg-emerald-500/10
                            px-4
                            py-2
                            text-xs
                            font-bold
                            text-emerald-300
                        "
                    >

                        <TrendingUp size={14} />

                        {
                            journal.progress_percentage
                            ??
                            0
                        }%

                    </div>

                </div>



                {/* CONTENT */}

                <div
                    className="
                        whitespace-pre-wrap
                        text-[15px]
                        leading-8
                        text-zinc-300
                    "
                >

                    {journal.content}

                </div>



                {/* PROBLEM SOLUTION */}

                {
                    journal.problem_solutions &&
                    journal.problem_solutions.length > 0 && (

                        <div className="mt-8 space-y-5">

                            {
                                journal.problem_solutions.map(

                                    (
                                        item: any,
                                        index: number
                                    ) => (

                                        <div
                                            key={index}
                                            className="
                                                overflow-hidden
                                                rounded-3xl
                                                border
                                                border-zinc-800
                                            "
                                        >

                                            {/* PROBLEM */}

                                            <div
                                                className="
                                                    border-b
                                                    border-red-500/10
                                                    bg-red-500/3
                                                    p-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        mb-3
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <AlertTriangle
                                                        size={18}
                                                        className="text-red-400"
                                                    />

                                                    <h3
                                                        className="
                                                            font-semibold
                                                            text-red-300
                                                        "
                                                    >

                                                        Problem

                                                    </h3>

                                                </div>

                                                <p
                                                    className="
                                                        text-sm
                                                        leading-7
                                                        text-zinc-300
                                                    "
                                                >

                                                    {item.problem}

                                                </p>

                                            </div>



                                            {/* SOLUTION */}

                                            <div
                                                className="
                                                    bg-emerald-500/3
                                                    p-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        mb-3
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-emerald-400"
                                                    />

                                                    <h3
                                                        className="
                                                            font-semibold
                                                            text-emerald-300
                                                        "
                                                    >

                                                        Solution

                                                    </h3>

                                                </div>

                                                <p
                                                    className="
                                                        text-sm
                                                        leading-7
                                                        text-zinc-300
                                                    "
                                                >

                                                    {item.solution}

                                                </p>

                                            </div>

                                        </div>

                                    )

                                )
                            }

                        </div>

                    )
                }



                {/* CODE SNIPPETS */}

                {
                    journal.code_snippets &&
                    journal.code_snippets.length > 0 && (

                        <div className="mt-8 space-y-4">

                            {
                                journal.code_snippets.map(

                                    (
                                        snippet: string,
                                        index: number
                                    ) => (

                                        <div
                                            key={index}
                                            className="
                                                overflow-hidden
                                                rounded-3xl
                                                border
                                                border-zinc-800
                                                bg-black
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    border-b
                                                    border-zinc-800
                                                    bg-zinc-950
                                                    px-5
                                                    py-3
                                                    text-xs
                                                    text-zinc-500
                                                "
                                            >

                                                <Code2 size={14} />

                                                Code Snippet

                                            </div>

                                            <pre
                                                className="
                                                    overflow-x-auto
                                                    p-5
                                                    text-sm
                                                    leading-7
                                                    text-zinc-300
                                                "
                                            >

                                                <code>
                                                    {snippet}
                                                </code>

                                            </pre>

                                        </div>

                                    )

                                )
                            }

                        </div>

                    )
                }



                {/* FOOTER */}

                <div
                    className="
                        mt-8
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-zinc-800
                        pt-5
                        text-xs
                        text-zinc-500
                    "
                >

                    <span>

                        {
                            new Date(
                                journal.created_at
                            ).toLocaleString()
                        }

                    </span>



                    <div className="flex items-center gap-4">

                        <span>
                            {
                                journal.likes_count
                                ??
                                0
                            } likes
                        </span>

                        <span>
                            {
                                journal.comments_count
                                ??
                                0
                            } comments
                        </span>

                    </div>

                </div>

            </div>

        </article>

    )

}