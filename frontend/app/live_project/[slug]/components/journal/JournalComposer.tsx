"use client"

import { useState } from "react"

import {
    ChevronDown,
    Plus,
    Sparkles,
    X,
    Code2,
    Lightbulb,
    ImageIcon,
    Rocket,
    Bug,
    Flag,
    Layers,
    Megaphone,
    AlertTriangle,
    TrendingUp,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"

import type {
    GetLiveProjectJournal
} from "../../types/liveProject"

import type {
    JournalEntryType
} from "../../types/liveProject"



interface JournalComposerProps {

    currentDay: number

    baseProgress: number

    onCancel: () => void

    onPublish: (
        entry: GetLiveProjectJournal
    ) => void

}



const ENTRY_TYPES = {

    progress: {
        label: "Progress",
        icon: TrendingUp,
        color:
            "text-orange-300",
        border:
            "border-orange-500/20",
        bg:
            "bg-orange-500/10",
    },

    milestone: {
        label: "Milestone",
        icon: Flag,
        color:
            "text-yellow-300",
        border:
            "border-yellow-500/20",
        bg:
            "bg-yellow-500/10",
    },

    bugfix: {
        label: "Bug Fix",
        icon: Bug,
        color:
            "text-blue-300",
        border:
            "border-blue-500/20",
        bg:
            "bg-blue-500/10",
    },

    deployment: {
        label: "Deployment",
        icon: Rocket,
        color:
            "text-emerald-300",
        border:
            "border-emerald-500/20",
        bg:
            "bg-emerald-500/10",
    },

    architecture: {
        label: "Architecture",
        icon: Layers,
        color:
            "text-purple-300",
        border:
            "border-purple-500/20",
        bg:
            "bg-purple-500/10",
    },

    announcement: {
        label: "Announcement",
        icon: Megaphone,
        color:
            "text-pink-300",
        border:
            "border-pink-500/20",
        bg:
            "bg-pink-500/10",
    },

    failure: {
        label: "Failure",
        icon: AlertTriangle,
        color:
            "text-red-300",
        border:
            "border-red-500/20",
        bg:
            "bg-red-500/10",
    },

}



export default function JournalComposer({

    currentDay,

    baseProgress,

    onCancel,

    onPublish,

}: JournalComposerProps) {



    const [type, setType] =
        useState<JournalEntryType>(
            "progress"
        )

    const [content, setContent] =
        useState("")

    const [progress, setProgress] =
        useState(baseProgress)

    const [extrasOpen, setExtrasOpen] =
        useState(false)



    const [codeSnippets, setCodeSnippets] =
        useState([
            {
                language: "",
                code: "",
            }
        ])



    const [problemSolutions,
        setProblemSolutions] =
        useState([
            {
                problem: "",
                solution: "",
            }
        ])



    const [mediaUrls, setMediaUrls] =
        useState([""])



    const currentType =
        ENTRY_TYPES[
            type as keyof typeof ENTRY_TYPES
        ]



    const TypeIcon =
        currentType.icon



    function publishEntry() {

        onPublish({

            id:
                crypto.randomUUID(),

            day_number:
                currentDay,

            entry_type:
                type,

            content,

            progress_percentage:
                progress,

            code_snippets:
                codeSnippets.filter(
                    (snippet) =>
                        snippet.code.trim() !== ""
                ),

            problem_solutions:
                problemSolutions.filter(
                    (item) =>
                        item.problem.trim() !== ""
                ),

            media_urls:
                mediaUrls.filter(
                    (url) =>
                        url.trim() !== ""
                ),

            likes_count: 0,

            comments_count: 0,

            created_at:
                new Date().toISOString(),

        })

    }



    return (

        <RevealWrapper delay={0.05}>

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-4xl
                    border
                    border-white/10
                    bg-[#0b0b0b]
                    p-6
                    md:p-8
                "
            >

                {/* BACKGROUND */}

                <div
                    className="
                        absolute
                        -right-25
                        -top-25
                        h-65
                        w-65
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                <div className="relative z-10">

                    {/* HEADER */}

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

                                Day {currentDay}

                            </div>



                            <h2
                                className="
                                    mt-5
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                Build Journal Entry
                            </h2>



                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-relaxed
                                    text-zinc-400
                                "
                            >
                                Document what you built,
                                broke, learned, shipped,
                                or redesigned today.
                            </p>

                        </div>



                        <div
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                ${currentType.border}
                                ${currentType.bg}
                                ${currentType.color}
                            `}
                        >

                            <TypeIcon size={18} />

                            {currentType.label}

                        </div>

                    </div>



                    {/* TYPES */}

                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                    {
                        (
                            Object.entries(
                                ENTRY_TYPES
                            ) as [
                                JournalEntryType,
                                typeof ENTRY_TYPES[JournalEntryType]
                            ][]
                        ).map(([key, value]) => {

                            const Icon =
                                value.icon

                            const active =
                                key === type

                            return (

                                <button
                                    key={key}
                                    onClick={() =>
                                        setType(key)
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        border
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-all
                                        ${
                                            active
                                                ? `
                                                    ${value.border}
                                                    ${value.bg}
                                                    ${value.color}
                                                `
                                                : `
                                                    border-white/10
                                                    bg-white/3
                                                    text-zinc-400
                                                `
                                        }
                                    `}
                                >

                                    <Icon size={16} />

                                    {value.label}

                                </button>

                            )

                        })
                    }

                    </div>



                    {/* CONTENT */}

                    <div className="mt-8">

                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows={8}
                            placeholder="
Write today's build story...

• What did you implement?
• What problems did you hit?
• What architecture decisions changed?
• What finally worked?
                            "
                            className="
                                w-full
                                resize-none
                                rounded-[28px]
                                border
                                border-white/10
                                bg-white/3
                                p-6
                                text-base
                                leading-8
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-600
                                focus:border-orange-500/20
                                focus:bg-orange-500/3
                            "
                        />

                    </div>



                    {/* PROGRESS */}

                    <div className="mt-8">

                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.25em]
                                        text-zinc-500
                                    "
                                >
                                    Build Progress
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-zinc-400
                                    "
                                >
                                    Reflect current project completion.
                                </p>

                            </div>



                            <div
                                className="
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-orange-300
                                "
                            >
                                {progress}%
                            </div>

                        </div>



                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={progress}
                            onChange={(e) =>
                                setProgress(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="
                                h-3
                                w-full
                                cursor-pointer
                                accent-orange-500
                            "
                        />

                    </div>



                    {/* EXTRAS */}

                    <div className="mt-8">

                        <button
                            onClick={() =>
                                setExtrasOpen(
                                    !extrasOpen
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/3
                                px-5
                                py-4
                                text-sm
                                font-medium
                                text-zinc-300
                                transition-all
                                hover:border-white/20
                                hover:bg-white/5
                            "
                        >

                            <ChevronDown
                                size={18}
                                className={`
                                    transition-transform
                                    ${
                                        extrasOpen
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                            Advanced Build Details

                        </button>



                        {extrasOpen && (

                            <div
                                className="
                                    mt-6
                                    space-y-8
                                "
                            >

                                {/* CODE */}

                                <div>

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <Code2
                                            size={18}
                                            className="
                                                text-orange-300
                                            "
                                        />

                                        <h3
                                            className="
                                                text-lg
                                                font-bold
                                                text-white
                                            "
                                        >
                                            Code Snippets
                                        </h3>

                                    </div>



                                    {codeSnippets.map(
                                        (
                                            snippet,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className="
                                                    mb-4
                                                    rounded-3xl
                                                    border
                                                    border-white/10
                                                    bg-white/3
                                                    p-5
                                                "
                                            >

                                                <input
                                                    type="text"
                                                    placeholder="Language"
                                                    value={
                                                        snippet.language
                                                    }
                                                    onChange={(e) => {

                                                        const updated =
                                                            [...codeSnippets]

                                                        updated[index]
                                                            .language =
                                                            e.target.value

                                                        setCodeSnippets(
                                                            updated
                                                        )

                                                    }}
                                                    className="
                                                        mb-4
                                                        w-full
                                                        rounded-2xl
                                                        border
                                                        border-white/10
                                                        bg-black/30
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        text-white
                                                        outline-none
                                                    "
                                                />



                                                <textarea
                                                    rows={6}
                                                    placeholder="Paste your code..."
                                                    value={
                                                        snippet.code
                                                    }
                                                    onChange={(e) => {

                                                        const updated =
                                                            [...codeSnippets]

                                                        updated[index]
                                                            .code =
                                                            e.target.value

                                                        setCodeSnippets(
                                                            updated
                                                        )

                                                    }}
                                                    className="
                                                        w-full
                                                        rounded-2xl
                                                        border
                                                        border-white/10
                                                        bg-black/30
                                                        p-4
                                                        font-mono
                                                        text-sm
                                                        text-white
                                                        outline-none
                                                    "
                                                />

                                            </div>

                                        )
                                    )}



                                    <button
                                        onClick={() =>
                                            setCodeSnippets([
                                                ...codeSnippets,
                                                {
                                                    language: "",
                                                    code: "",
                                                }
                                            ])
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            border-orange-500/20
                                            bg-orange-500/10
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-orange-300
                                        "
                                    >

                                        <Plus size={16} />

                                        Add Snippet

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>



                    {/* ACTIONS */}

                    <div
                        className="
                            mt-10
                            flex
                            flex-col-reverse
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                        "
                    >

                        <button
                            onClick={onCancel}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/3
                                px-6
                                py-4
                                text-sm
                                font-semibold
                                text-zinc-300
                                transition-all
                                hover:border-red-500/20
                                hover:bg-red-500/10
                                hover:text-red-300
                            "
                        >

                            <X size={18} />

                            Cancel

                        </button>



                        <button
                            onClick={publishEntry}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
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

                            <Rocket size={18} />

                            Publish Entry

                        </button>

                    </div>

                </div>

            </section>

        </RevealWrapper>
    )
}