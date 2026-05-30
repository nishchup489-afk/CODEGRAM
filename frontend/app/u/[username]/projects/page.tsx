"use client"

import { useEffect, useRef, useState } from "react"

import gsap from "gsap"

import {
    MessageCircle,
    Eye,
    Bookmark,
    MoreHorizontal,
    Github,
    ExternalLink,
    Heart,
} from "lucide-react"

import api from "@/app/lib/api"

import type { GetProject }
from "@/app/lib/type/project"

import useCurrentUser
from "@/app/lib/currentUser"

import ProfilePreview
from "./components/ProfilePreview"

import ProjectStar
from "./components/ProjectStar"
import { useUser } from "@clerk/nextjs"
import AddComment from "./components/CommentSection"
import ShareProject from "./components/ShareProject"



export default function ProjectsFeed() {

    const [mainLoading, setMainLoading] =
        useState(false)

    const [mainError, setMainError] =
        useState<string>("")

    const [projects, setProjects] =
        useState<GetProject[]>([])

    const [expandedProjects, setExpandedProjects] =
        useState<Record<string, boolean>>({})

    const [savedProjects, setSavedProjects] =
        useState<Record<string, boolean>>({})



    const cardRefs =
        useRef<Record<string, HTMLDivElement | null>>({})

    const bookmarkRefs =
        useRef<Record<string, HTMLButtonElement | null>>({})

    const overlayHeartRefs =
        useRef<Record<string, HTMLDivElement | null>>({})

    const lastTapRef =
        useRef<Record<string, number>>({})

    const { user , isLoaded } = useUser()



    const {
        currentUser,
    } = useCurrentUser()



    useEffect(() => {

        const fetchAllProjects =
            async () => {

            try {

                setMainError("")

                setMainLoading(true)

                const res = await api.get(
                    `/projects?limit=12&clerk_user_id=${currentUser?.clerk_user_id}`
                )

                setProjects(
                    res.data.items
                )

            } catch (err) {

                console.error(err)

                setMainError(
                    "There was a problem fetching projects"
                )

            } finally {

                setMainLoading(false)
            }
        }

        if (currentUser?.clerk_user_id) {

            fetchAllProjects()
        }

    }, [currentUser?.clerk_user_id])



    useEffect(() => {

        if (projects.length > 0) {

            const cards =
                Object.values(
                    cardRefs.current
                ).filter(Boolean)

            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 24,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                }
            )
        }

    }, [projects])



    const toggleExpand = (
        projectId: string
    ) => {

        setExpandedProjects((prev) => ({
            ...prev,
            [projectId]:
                !prev[projectId],
        }))
    }



    const animateOverlayHeart = (
        projectId: string
    ) => {

        const overlay =
            overlayHeartRefs.current[projectId]

        if (!overlay) return

        gsap.killTweensOf(overlay)

        gsap.set(overlay, {
            scale: 0,
            opacity: 1,
        })

        gsap.to(overlay, {

            scale: 1,

            duration: 0.25,

            ease: "back.out(2)",

            onComplete: () => {

                gsap.to(overlay, {

                    opacity: 0,

                    scale: 1.15,

                    duration: 0.4,

                    delay: 0.3,

                    ease: "power2.in",
                })
            },
        })
    }



    const toggleSave = (
        projectId: string
    ) => {

        setSavedProjects((prev) => ({
            ...prev,
            [projectId]:
                !prev[projectId],
        }))

        const btn =
            bookmarkRefs.current[projectId]

        if (btn) {

            gsap.fromTo(
                btn,
                { scale: 1 },
                {
                    scale: 1.25,
                    duration: 0.12,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out",
                }
            )
        }
    }



const toggleProjectStar = async (

    slug: string,

    projectId: string,

    isStarred: boolean,

) => {

    try {

        if (isStarred) {

            await api.delete(
                `/projects/${slug}/star`,
                {
                    params: {
                        clerk_user_id: user?.id,
                    },
                }
            )

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? {
                              ...p,
                              is_starred: false,
                              stars_count:
                                  Math.max(
                                      0,
                                      p.stars_count - 1
                                  ),
                          }
                        : p
                )
            )

        } else {

            await api.post(
                `/projects/${slug}/star`,
                {},
                {
                    params: {
                        clerk_user_id: user?.id,
                    },
                }
            )

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? {
                              ...p,
                              is_starred: true,
                              stars_count:
                                  p.stars_count + 1,
                          }
                        : p
                )
            )
        }

    } catch (err: any) {

        // ====================================
        // HANDLE 409
        // ====================================

        if (err.response?.status === 409) {

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? {
                              ...p,
                              is_starred: true,
                          }
                        : p
                )
            )

            return
        }

        console.error(err)
    }
}


    const handleImageTap = (
        projectId: string,
    ) => {

        const now = Date.now()

        const last =
            lastTapRef.current[projectId] || 0

        if (now - last < 300) {

            animateOverlayHeart(projectId)
        }

        lastTapRef.current[projectId] = now
    }



    if (mainLoading) {

        return (

            <div className="
                min-h-screen
                bg-black
                flex
                items-center
                justify-center
                text-white
            ">

                Loading...

            </div>
        )
    }



    if (mainError) {

        return (

            <div className="
                min-h-screen
                bg-black
                flex
                items-center
                justify-center
                text-red-500
            ">

                {mainError}

            </div>
        )
    }



    return (

        <div className="
            min-h-screen
            w-full
            bg-black
            flex
            justify-center
            py-10
            px-4
        ">

            <div className="
                w-full
                max-w-2xl
                flex
                flex-col
                gap-8
            ">

                {projects.map((p) => {

                    const MAX_LENGTH = 140

                    const expanded =
                        expandedProjects[p.id]

                    const isLong =
                        p.description.length >
                        MAX_LENGTH

                    const displayedText =
                        expanded
                        ? p.description
                        : p.description.slice(
                            0,
                            MAX_LENGTH
                        )

                    const isSaved =
                        savedProjects[p.id]



                    return (

                        <div
                            key={p.id}
                            ref={(el) => {
                                cardRefs.current[p.id] = el
                            }}
                            className="
                                bg-[#0a0a0a]
                                border
                                border-zinc-900
                                rounded-3xl
                                overflow-hidden
                                shadow-2xl
                            "
                        >

                            {/* TOP */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                px-5
                                py-4
                            ">

                                <ProfilePreview
                                    profile={p.user}
                                    created_at={p.created_at}
                                />



                                <div className="
                                    flex
                                    items-center
                                    gap-1
                                ">

                                    <button className="
                                        px-4
                                        py-1.5
                                        rounded-full
                                        bg-linear-to-r
                                        from-orange-500
                                        to-red-500
                                        text-white
                                        text-sm
                                        font-semibold
                                    ">
                                        Follow
                                    </button>



                                    <button className="
                                        p-2
                                        rounded-full
                                        text-zinc-500
                                        hover:text-white
                                        hover:bg-zinc-900
                                        transition
                                    ">

                                        <MoreHorizontal size={20} />

                                    </button>

                                </div>

                            </div>



                            {/* HERO */}

                            {p.thumbnail_url && (

                                <div
                                    className="
                                        relative
                                        w-full
                                        aspect-video
                                        bg-zinc-900
                                        overflow-hidden
                                        cursor-pointer
                                        group
                                    "
                                    onClick={() =>
                                        handleImageTap(p.id)
                                    }
                                >

                                    <img
                                        src={p.thumbnail_url}
                                        alt={p.title}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                            transition-transform
                                            duration-700
                                            group-hover:scale-105
                                            select-none
                                        "
                                        draggable={false}
                                    />



                                    <div
                                        ref={(el) => {
                                            overlayHeartRefs.current[p.id] = el
                                        }}
                                        className="
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                            justify-center
                                            pointer-events-none
                                            opacity-0
                                        "
                                    >

                                        <Heart
                                            size={120}
                                            className="
                                                text-white
                                                drop-shadow-2xl
                                            "
                                            fill="white"
                                            strokeWidth={1.5}
                                        />

                                    </div>

                                </div>

                            )}



                            {/* ACTIONS */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                px-5
                                pt-4
                                pb-2
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-1
                                ">

                                <ProjectStar
                                            stars={p.stars_count}

                                            isStarred={p.is_starred}

                                            toggleProjectStar={() =>
                                                toggleProjectStar(
                                                    p.slug,
                                                    p.id,
                                                    p.is_starred,
                                                )
                                            }
                                />



                                    <AddComment 
                                    slug={p.slug}/>



                                    <ShareProject 
                                    slug={p.slug}
                                    />

                                </div>



                                <button
                                    ref={(el) => {
                                        bookmarkRefs.current[p.id] = el
                                    }}
                                    onClick={() =>
                                        toggleSave(p.id)
                                    }
                                    className="
                                        p-2
                                        rounded-full
                                        hover:bg-zinc-900
                                        transition
                                    "
                                >

                                    <Bookmark
                                        size={26}
                                        className={
                                            isSaved
                                                ? "text-white"
                                                : "text-zinc-200 hover:text-zinc-400"
                                        }
                                        fill={
                                            isSaved
                                                ? "currentColor"
                                                : "none"
                                        }
                                        strokeWidth={2}
                                    />

                                </button>

                            </div>



                            {/* BODY */}

                            <div className="
                                px-5
                                pt-3
                                pb-5
                                flex
                                flex-col
                                gap-3
                            ">

                                <h1 className="
                                    text-xl
                                    font-bold
                                    text-white
                                ">

                                    {p.title}

                                </h1>



                                <p className="
                                    text-zinc-300
                                    text-sm
                                    leading-relaxed
                                ">

                                    <span className="
                                        font-semibold
                                        text-white
                                        mr-2
                                    ">

                                        @{p.user.username}

                                    </span>

                                    {displayedText}

                                    {isLong &&
                                        !expanded &&
                                        "..."}

                                    {isLong && (

                                        <button
                                            onClick={() =>
                                                toggleExpand(p.id)
                                            }
                                            className="
                                                text-zinc-500
                                                hover:text-zinc-300
                                                ml-1
                                            "
                                        >

                                            {expanded
                                                ? "less"
                                                : "more"}

                                        </button>

                                    )}

                                </p>



                                <div className="
                                    flex
                                    flex-wrap
                                    gap-1.5
                                ">

                                    {p.tech_stack.map((tech) => (

                                        <span
                                            key={tech}
                                            className="
                                                px-2.5
                                                py-0.5
                                                rounded-md
                                                bg-zinc-900
                                                text-xs
                                                text-zinc-400
                                            "
                                        >

                                            #
                                            {tech
                                                .toLowerCase()
                                                .replace(/\s+/g, "")}

                                        </span>

                                    ))}

                                </div>



                                <div className="
                                    flex
                                    items-center
                                    gap-4
                                    pt-1
                                ">

                                    <a
                                        href={p.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-zinc-500
                                            hover:text-white
                                            text-xs
                                            font-medium
                                        "
                                    >

                                        <Github size={14} />

                                        Code

                                    </a>



                                    {p.live_url && (

                                        <a
                                            href={p.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-zinc-500
                                                hover:text-white
                                                text-xs
                                                font-medium
                                            "
                                        >

                                            <ExternalLink size={14} />

                                            Live

                                        </a>

                                    )}



                                    <span className="
                                        ml-auto
                                        text-zinc-600
                                        text-xs
                                    ">

                                        {p.views_count.toLocaleString()} views

                                    </span>

                                </div>

                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}