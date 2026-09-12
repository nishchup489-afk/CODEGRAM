"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

/**
 * The sync screen's visuals.
 *
 * Purely presentational: it no longer decides anything. Which page the user
 * ends up on is resolved on the server (see page.tsx), so this component only
 * has two jobs — look alive while the server works, and offer a way out if
 * the server could not finish.
 */
export default function SyncStage({
    error,
}: {
    error?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const orbRef = useRef<HTMLDivElement>(null)

    const loadingTexts = [
        "Syncing identity...",
        "Preparing your workspace...",
        "Loading your universe...",
        "Connecting neural systems...",
        "Almost there...",
    ]

    const [currentText, setCurrentText] = useState(0)

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1 },
        )

        tl.fromTo(
            orbRef.current,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
            "-=0.5",
        )

        const spin = gsap.to(orbRef.current, {
            rotate: 360,
            duration: 10,
            repeat: -1,
            ease: "linear",
        })

        const bob = gsap.to(orbRef.current, {
            y: -12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        })

        return () => {
            tl.kill()
            spin.kill()
            bob.kill()
        }
    }, [])

    useEffect(() => {
        if (error) return

        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % loadingTexts.length)
        }, 2200)

        return () => clearInterval(interval)
        // loadingTexts is a stable literal; only the error state changes the cadence.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (
        <div
            ref={containerRef}
            className="
                min-h-screen
                bg-black
                text-white
                flex
                items-center
                justify-center
                overflow-hidden
                relative
            "
        >

            {/* Background Glow */}

            <div
                className="
                    absolute
                    w-175
                    h-175
                    rounded-full
                    bg-orange-500/10
                    blur-3xl
                "
            />

            {/* Grid */}

            <div
                className="
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                    bg-size-[40px_40px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    gap-10
                "
            >

                {/* Orb */}

                <div
                    ref={orbRef}
                    className="
                        relative
                        w-40
                        h-40
                        rounded-full
                        border
                        border-orange-400/30
                        flex
                        items-center
                        justify-center
                        shadow-[0_0_80px_rgba(249,115,22,0.35)]
                    "
                >

                    <div
                        className="
                            absolute
                            inset-4
                            rounded-full
                            border
                            border-orange-300/20
                        "
                    />

                    {!error && (
                        <div
                            className="
                                absolute
                                inset-0
                                rounded-full
                                animate-ping
                                bg-orange-400/10
                            "
                        />
                    )}

                    <div
                        className="
                            w-16
                            h-16
                            rounded-full
                            bg-linear-to-br
                            from-orange-300
                            to-orange-600
                        "
                    />

                </div>

                {/* Text */}

                <div className="text-center">

                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            tracking-tight
                            bg-linear-to-r
                            from-white
                            via-orange-200
                            to-orange-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        DevManiac
                    </h1>

                    <p
                        aria-live="polite"
                        className="
                            mt-5
                            text-zinc-400
                            text-lg
                            tracking-wide
                            min-h-7
                        "
                    >
                        {error ?? loadingTexts[currentText]}
                    </p>

                    {error && (
                        <a
                            href="/sync"
                            className="
                                mt-6
                                inline-block
                                rounded-md
                                border
                                border-orange-400/40
                                px-5
                                py-2
                                text-sm
                                text-orange-200
                                transition
                                hover:bg-orange-400/10
                            "
                        >
                            Try again
                        </a>
                    )}

                </div>

            </div>

        </div>
    )
}
