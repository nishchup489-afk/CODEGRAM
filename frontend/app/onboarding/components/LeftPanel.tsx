'use client'

import { useEffect, useRef } from 'react'

import { gsap } from 'gsap'

import {
    Sparkles,
    ShieldCheck,
    Code2,
    Layers3,
} from 'lucide-react'


export default function LeftPanel() {

    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        gsap.fromTo(
            panelRef.current,
            {
                opacity: 0,
                x: -60,
            },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power4.out',
            }
        )

    }, [])


    return (
        <div
            ref={panelRef}
            className="
                hidden
                lg:flex
                flex-col
                justify-center
                relative
            "
        >

            {/* TOP BADGE */}

            <div
                className="
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/4
                    px-4
                    py-2
                    text-sm
                    text-zinc-300
                    backdrop-blur-xl
                "
            >
                <Sparkles size={14} />
                onboarding sequence initialized
            </div>


            {/* HERO */}

            <div className="mt-10">

                <h1
                    className="
                        text-6xl
                        font-black
                        leading-[0.92]
                        tracking-[-0.08em]
                    "
                >
                    Build your

                    <span
                        className="
                            block
                            bg-linear-to-r
                            from-red-500
                            via-orange-400
                            to-red-600
                            bg-clip-text
                            text-transparent
                        "
                    >
                        developer identity.
                    </span>

                </h1>


                <p
                    className="
                        mt-8
                        max-w-xl
                        text-lg
                        leading-8
                        text-zinc-400
                    "
                >
                    CODEGRAM is where developers
                    showcase projects, build reputation,
                    and connect with people who
                    actually ship things.
                </p>

            </div>


            {/* TERMINAL CARD */}

            <div
                className="
                    relative
                    mt-14
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-white/3
                    p-8
                    backdrop-blur-2xl
                    shadow-[0_0_120px_rgba(0,0,0,0.8)]
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-br
                        from-red-500/10
                        via-orange-500/5
                        to-transparent
                    "
                />


                {/* TOP DOTS */}

                <div className="relative flex gap-2">

                    <div className="h-3 w-3 rounded-full bg-red-500" />

                    <div className="h-3 w-3 rounded-full bg-yellow-500" />

                    <div className="h-3 w-3 rounded-full bg-green-500" />

                </div>


                {/* TERMINAL TEXT */}

                <div
                    className="
                        relative
                        mt-8
                        space-y-5
                        font-mono
                        text-sm
                    "
                >

                    <div className="flex items-center gap-3 text-zinc-500">
                        <ShieldCheck
                            size={16}
                            className="text-emerald-400"
                        />
                        identity verified
                    </div>

                    <div className="flex items-center gap-3 text-zinc-500">
                        <Code2
                            size={16}
                            className="text-orange-400"
                        />
                        syncing developer graph
                    </div>

                    <div className="flex items-center gap-3 text-zinc-500">
                        <Layers3
                            size={16}
                            className="text-red-400"
                        />
                        preparing CODEGRAM workspace
                    </div>

                    <div
                        className="
                            pt-3
                            text-orange-400
                        "
                    >
                        → waiting for onboarding completion
                    </div>

                </div>

            </div>


            {/* BOTTOM PREVIEW */}

            <div
                className="
                    mt-10
                    grid
                    grid-cols-3
                    gap-4
                "
            >

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <p
                        className="
                            text-3xl
                            font-black
                            tracking-tighter
                        "
                    >
                        12k+
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-zinc-500
                        "
                    >
                        developer profiles
                    </p>
                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <p
                        className="
                            text-3xl
                            font-black
                            tracking-tighter
                        "
                    >
                        84k+
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-zinc-500
                        "
                    >
                        projects shipped
                    </p>
                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <p
                        className="
                            text-3xl
                            font-black
                            tracking-tighter
                        "
                    >
                        4.9★
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-zinc-500
                        "
                    >
                        builder reputation
                    </p>
                </div>

            </div>

        </div>
    )
}