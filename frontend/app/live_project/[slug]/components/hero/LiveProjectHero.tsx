"use client"

import {
    Sparkles,
    Circle,
} from "lucide-react"

import HeroLinks
from "./HeroLinks"

import HeroProgress
from "./HeroProgress"

import HeroStats
from "./HeroStats"

import RevealWrapper
from "../animations/RevealWrapper"

import type {
    GetLiveProject
} from "@/app/lib/type/liveproject"



interface LiveProjectHeroProps {

    project: GetLiveProject

}



const STATUS = {

    active: {
        label: "Active",
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    paused: {
        label: "Paused",
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    completed: {
        label: "Completed",
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    abandoned: {
        label: "Abandoned",
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

}



export default function LiveProjectHero({

    project,

}: LiveProjectHeroProps) {



    const status =
        STATUS[
            project.status as keyof typeof STATUS
        ] || STATUS.active



    return (

        <div
            className="
                flex
                flex-col
                gap-5
            "
        >

            {/* MAIN HERO */}

            <RevealWrapper>

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[36px]
                        border
                        border-white/10
                        bg-[#0b0b0b]
                        p-7
                        md:p-10
                    "
                >

                    {/* BACKGROUND */}

                    <div
                        className="
                            absolute
                            -right-25
                            -top-25
                            h-80
                            w-[320px]
                            rounded-full
                            bg-orange-500/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-30
                            -left-30
                            h-65
                            w-65
                            rounded-full
                            bg-orange-400/5
                            blur-3xl
                        "
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
                                lg:flex-row
                                lg:items-start
                                lg:justify-between
                            "
                        >

                            {/* LEFT */}

                            <div>

                                {/* DAY */}

                                <div
                                    className="
                                        mb-5
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

                                    Live Build

                                </div>



                                {/* TITLE */}

                                <h1
                                    className="
                                        text-5xl
                                        font-black
                                        tracking-tight
                                        text-white
                                        sm:text-6xl
                                    "
                                >
                                    {project.title}
                                </h1>



                                {/* GOAL */}

                                <p
                                    className="
                                        mt-5
                                        max-w-3xl
                                        text-base
                                        leading-relaxed
                                        text-zinc-400
                                        sm:text-lg
                                    "
                                >
                                    {project.goal}
                                </p>



                                {/* TECH STACK */}

                                <div
                                    className="
                                        mt-7
                                        flex
                                        flex-wrap
                                        gap-3
                                    "
                                >

                                    {project.tech_stack.map(
                                        (tech) => (

                                            <div
                                                key={tech}
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-white/3
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-medium
                                                    text-zinc-300
                                                    backdrop-blur-xl
                                                "
                                            >
                                                {tech}
                                            </div>

                                        )
                                    )}

                                </div>

                            </div>



                            {/* STATUS */}

                            <div
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    backdrop-blur-xl
                                    ${status.border}
                                    ${status.bg}
                                    ${status.color}
                                `}
                            >

                                <Circle
                                    size={10}
                                    fill="currentColor"
                                    strokeWidth={0}
                                />

                                {status.label}

                            </div>

                        </div>



                        {/* LINKS */}

                        <div className="mt-10">

                            <HeroLinks
                                github_url={
                                    project.github_url
                                }
                                live_url={
                                    project.live_url
                                }
                                demo_video_url={
                                    project.demo_video_url
                                }
                            />

                        </div>

                    </div>

                </section>

            </RevealWrapper>



            {/* PROGRESS */}

            <HeroProgress
                progress_percentage={
                    project.progress_percentage
                }
            />



            {/* STATS */}

            <HeroStats
                views_count={
                    project.views_count
                }
                journal_count={
                    project.journal_count
                }
                created_at={
                    project.created_at
                }
            />

        </div>

    )
}