"use client"

import { useState, useEffect } from "react"

import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"

import Image from "next/image"
import { useRouter } from "next/navigation"

import {
    User,
    Github,
    Linkedin,
    Globe,
    Users,
    FolderGit2,
    FileText,
    Pencil,
    Archive,
    X,
} from "lucide-react"



export default function ProfileHeader() {

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    const router = useRouter()



    const [
        showAvatarViewer,
        setShowAvatarViewer,
    ] = useState(false)



    const [
        showBannerViewer,
        setShowBannerViewer,
    ] = useState(false)



    const [profileData, setProfileData] = useState({

        clerk_user_id: "",

        username: "",

        display_name: "",

        bio: "",

        avatar_url: "",

        banner_url: "",

        github_url: "",

        linkedin_url: "",

        portfolio_url: "",

        reputation_score: 0,

        followers_count: 0,

        following_count: 0,

        posts_count: 0,

        project_count: 0,

    })



    const { user, isLoaded } = useUser()



    useEffect(() => {

        if (!isLoaded) {

            setLoading(true)

            return

        }

        if (!user?.id) {

            setLoading(false)

            return

        }

        const getProfileData = async () => {

            try {

                setLoading(true)

                setError("")



                const result = await api.get(
                    `/dashboard/profile?clerk_user_id=${user.id}`
                )



                setProfileData(result.data)

            } catch (err) {

                console.error(err)

                setError(
                    "Something went wrong fetching profile data"
                )

            } finally {

                setLoading(false)

            }

        }



        getProfileData()

    }, [isLoaded, user?.id])



    if (loading) {

        return (

            <div
                className="
                    animate-pulse
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/3
                "
            >

                <div className="h-48 bg-white/5" />

                <div className="px-6 pb-6">

                    <div
                        className="
                            -mt-16
                            h-32
                            w-32
                            rounded-full
                            border-4
                            border-black
                            bg-white/10
                        "
                    />

                    <div className="mt-5 h-7 w-52 rounded bg-white/10" />

                    <div className="mt-3 h-5 w-36 rounded bg-white/5" />

                    <div className="mt-6 h-16 rounded bg-white/5" />

                </div>

            </div>

        )

    }



    if (error) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    p-5
                    text-sm
                    text-red-400
                "
            >
                {error}
            </div>

        )

    }



    return (

        <>

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-black
                "
            >



                {/* BANNER */}

                <button
                    type="button"
                    onClick={() =>
                        setShowBannerViewer(true)
                    }
                    className="
                        relative
                        block
                        h-48
                        w-full
                        overflow-hidden
                        border-b
                        border-white/10
                        bg-linear-to-r
                        from-zinc-900
                        via-black
                        to-zinc-900
                    "
                >

                    {
                        profileData.banner_url && (

                            <Image
                                src={profileData.banner_url}
                                alt="Banner"
                                fill
                                className="
                                    object-cover
                                    opacity-80
                                "
                            />

                        )
                    }

                </button>



                {/* CONTENT */}

                <div className="px-6 pb-6">



                    {/* TOP */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            lg:flex-row
                            lg:items-end
                            lg:justify-between
                        "
                    >



                        {/* LEFT */}

                        <div>



                            {/* PROFILE IMAGE */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAvatarViewer(true)
                                }
                                className="
                                    relative
                                    -mt-16
                                    block
                                    h-32
                                    w-32
                                    overflow-hidden
                                    rounded-full
                                    border-4
                                    border-black
                                    bg-zinc-900
                                    shadow-[0_0_40px_rgba(255,255,255,0.05)]
                                "
                            >

                                {
                                    profileData.avatar_url ? (

                                        <Image
                                            src={profileData.avatar_url}
                                            alt="Profile"
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />

                                    ) : (

                                        <div
                                            className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <User
                                                size={40}
                                                className="text-zinc-600"
                                            />

                                        </div>

                                    )
                                }

                            </button>



                            {/* NAME */}

                            <div className="mt-5">

                                <h1
                                    className="
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    {profileData.display_name}
                                </h1>

                                <p
                                    className="
                                        mt-1
                                        text-zinc-500
                                    "
                                >
                                    @{profileData.username}
                                </p>

                            </div>



                            {/* BIO */}

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-relaxed
                                    text-zinc-300
                                "
                            >
                                {
                                    profileData.bio ||
                                    "No bio added yet."
                                }
                            </p>



                            {/* LINKS */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-4
                                "
                            >

                                {
                                    profileData.github_url && (

                                        <a
                                            href={profileData.github_url}
                                            target="_blank"
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-zinc-400
                                                transition-all
                                                hover:text-white
                                            "
                                        >

                                            <Github size={16} />

                                            GitHub

                                        </a>

                                    )
                                }



                                {
                                    profileData.linkedin_url && (

                                        <a
                                            href={profileData.linkedin_url}
                                            target="_blank"
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-zinc-400
                                                transition-all
                                                hover:text-white
                                            "
                                        >

                                            <Linkedin size={16} />

                                            LinkedIn

                                        </a>

                                    )
                                }



                                {
                                    profileData.portfolio_url && (

                                        <a
                                            href={profileData.portfolio_url}
                                            target="_blank"
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-zinc-400
                                                transition-all
                                                hover:text-white
                                            "
                                        >

                                            <Globe size={16} />

                                            Portfolio

                                        </a>

                                    )
                                }

                            </div>

                        </div>



                        {/* ACTION BUTTONS */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >

                            <button
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    transition-all
                                    hover:bg-white/10
                                "
                                onClick={() =>
                                    router.push("/dashboard/profile/edit")
                                }
                            >

                                <Pencil size={16} />

                                Edit Profile

                            </button>



                            <button
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    transition-all
                                    hover:bg-white/10
                                "
                                onClick={() =>
                                    router.push("/dashboard/profile/archive")
                                }
                            >

                                <Archive size={16} />

                                View Archive

                            </button>

                        </div>

                    </div>



                    {/* STATS */}

                    <div className="mt-8">



                        {/* MOBILE */}

                        <div
                            className="
                                flex
                                items-center
                                justify-around
                                border-y
                                border-white/10
                                py-5
                                lg:hidden
                            "
                        >

                            <div className="text-center">

                                <p
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >
                                    {profileData.posts_count}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    Posts
                                </p>

                            </div>



                            <div className="text-center">

                                <p
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >
                                    {profileData.followers_count}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    Followers
                                </p>

                            </div>



                            <div className="text-center">

                                <p
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >
                                    {profileData.following_count}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    Following
                                </p>

                            </div>



                            <div className="text-center">

                                <p
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >
                                    {profileData.project_count}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    Projects
                                </p>

                            </div>

                        </div>



                        {/* DESKTOP */}

                        <div
                            className="
                                hidden
                                grid-cols-4
                                gap-4
                                lg:grid
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-zinc-500
                                    "
                                >

                                    <Users size={16} />

                                    Followers

                                </div>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-black
                                    "
                                >
                                    {profileData.followers_count}
                                </h2>

                            </div>



                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-zinc-500
                                    "
                                >

                                    <Users size={16} />

                                    Following

                                </div>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-black
                                    "
                                >
                                    {profileData.following_count}
                                </h2>

                            </div>



                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-zinc-500
                                    "
                                >

                                    <FileText size={16} />

                                    Posts

                                </div>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-black
                                    "
                                >
                                    {profileData.posts_count}
                                </h2>

                            </div>



                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-zinc-500
                                    "
                                >

                                    <FolderGit2 size={16} />

                                    Projects

                                </div>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-black
                                    "
                                >
                                    {profileData.project_count}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>



            {/* FULLSCREEN AVATAR VIEWER */}

            {
                showAvatarViewer &&
                profileData.avatar_url && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-100
                            flex
                            items-center
                            justify-center
                            bg-black/95
                            p-6
                        "
                    >

                        <button
                            onClick={() =>
                                setShowAvatarViewer(false)
                            }
                            className="
                                absolute
                                right-6
                                top-6
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                p-3
                                transition
                                hover:bg-white/20
                            "
                        >

                            <X size={24} />

                        </button>



                        <div
                            className="
                                relative
                                h-[80vh]
                                w-[80vh]
                                max-w-full
                                overflow-hidden
                                rounded-3xl
                            "
                        >

                            <Image
                                src={profileData.avatar_url}
                                alt="Fullscreen avatar"
                                fill
                                className="
                                    object-contain
                                "
                            />

                        </div>

                    </div>

                )
            }



            {/* FULLSCREEN BANNER VIEWER */}

            {
                showBannerViewer &&
                profileData.banner_url && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-100
                            flex
                            items-center
                            justify-center
                            bg-black/95
                            p-6
                        "
                    >

                        <button
                            onClick={() =>
                                setShowBannerViewer(false)
                            }
                            className="
                                absolute
                                right-6
                                top-6
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                p-3
                                transition
                                hover:bg-white/20
                            "
                        >

                            <X size={24} />

                        </button>



                        <div
                            className="
                                relative
                                h-[80vh]
                                w-full
                                max-w-7xl
                                overflow-hidden
                                rounded-3xl
                            "
                        >

                            <Image
                                src={profileData.banner_url}
                                alt="Fullscreen banner"
                                fill
                                className="
                                    object-contain
                                "
                            />

                        </div>

                    </div>

                )
            }

        </>

    )

}