"use client"

import Image from "next/image"

import {
    Flame,
    Code2,
    TrendingUp,
    X,
    User,
} from "lucide-react"

import { useState } from "react"



type SuggestedBuilder = {
    name: string
    username: string
    stack: string
}



type RightSidebarProps = {

    avatarUrl: string | null

    bannerUrl?: string | null

    displayName: string

    username: string

    suggestedBuilders: SuggestedBuilder[]
}



export default function RightSidebar({

    avatarUrl,

    bannerUrl,

    displayName,

    username,

    suggestedBuilders,

}: RightSidebarProps) {



    const [
        showAvatarViewer,
        setShowAvatarViewer,
    ] = useState(false)



    const [
        showBannerViewer,
        setShowBannerViewer,
    ] = useState(false)



    return (

        <>

            <aside
                className="
                    sticky
                    top-0
                    hidden
                    h-screen
                    w-87.5
                    overflow-y-auto
                    p-6
                    xl:block
                "
            >

                <div className="space-y-6">



                    {/* PROFILE SUMMARY */}

                    <div
                        className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-white/10
                            bg-white/3
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
                                h-28
                                w-full
                                overflow-hidden
                                bg-zinc-900
                            "
                        >

                            {
                                bannerUrl ? (

                                    <Image
                                        src={bannerUrl}
                                        alt="Banner"
                                        fill
                                        className="
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            h-full
                                            w-full
                                            bg-linear-to-r
                                            from-zinc-900
                                            via-zinc-800
                                            to-black
                                        "
                                    />

                                )
                            }

                        </button>



                        {/* CONTENT */}

                        <div className="p-5">



                            {/* AVATAR + USER */}

                            <div
                                className="
                                    -mt-14
                                    flex
                                    items-end
                                    gap-4
                                "
                            >



                                {/* AVATAR */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAvatarViewer(true)
                                    }
                                    className="
                                        relative
                                        h-24
                                        w-24
                                        overflow-hidden
                                        rounded-full
                                        border-4
                                        border-black
                                        bg-zinc-900
                                        shadow-2xl
                                    "
                                >

                                    {
                                        avatarUrl ? (

                                            <Image
                                                src={avatarUrl}
                                                alt="Profile"
                                                fill
                                                sizes="96px"
                                                className="
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    bg-zinc-900
                                                "
                                            >

                                                <User
                                                    size={34}
                                                    className="
                                                        text-zinc-600
                                                    "
                                                />

                                            </div>

                                        )
                                    }

                                </button>



                                {/* USER INFO */}

                                <div className="pb-2">

                                    <p
                                        className="
                                            text-xl
                                            font-bold
                                        "
                                    >
                                        {displayName}
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            text-zinc-500
                                        "
                                    >
                                        @{username}
                                    </p>

                                </div>

                            </div>



                            {/* STATS */}

                            <div
                                className="
                                    mt-6
                                    grid
                                    grid-cols-3
                                    gap-3
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                        "
                                    >
                                        4
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        projects
                                    </p>

                                </div>



                                <div>

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                        "
                                    >
                                        38
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        followers
                                    </p>

                                </div>



                                <div>

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                        "
                                    >
                                        67%
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        shipped
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* BUILD STREAK */}

                    <div
                        className="
                            rounded-3xl
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
                            "
                        >

                            <Flame
                                size={18}
                                className="text-orange-500"
                            />

                            <h2 className="font-semibold">
                                Build Streak
                            </h2>

                        </div>



                        <div className="mt-5">

                            <p
                                className="
                                    text-4xl
                                    font-black
                                    text-orange-500
                                "
                            >
                                12
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                days active
                            </p>

                        </div>



                        <div
                            className="
                                mt-5
                                flex
                                gap-1
                            "
                        >

                            {
                                Array.from({
                                    length: 18
                                }).map((_, i) => (

                                    <div
                                        key={i}
                                        className={`
                                            h-3
                                            flex-1
                                            rounded-full

                                            ${
                                                i > 14
                                                ? 'bg-orange-500'
                                                : 'bg-green-500'
                                            }
                                        `}
                                    />

                                ))
                            }

                        </div>

                    </div>



                    {/* STACK */}

                    <div
                        className="
                            rounded-3xl
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
                            "
                        >

                            <Code2
                                size={18}
                                className="text-orange-500"
                            />

                            <h2 className="font-semibold">
                                Your Stack
                            </h2>

                        </div>



                        <div
                            className="
                                mt-6
                                space-y-4
                            "
                        >

                            {
                                [
                                    ['Python', 92],
                                    ['FastAPI', 85],
                                    ['Next.js', 74],
                                    ['PostgreSQL', 68],
                                    ['React', 61],
                                ].map(([name, progress]) => (

                                    <div key={name as string}>

                                        <div
                                            className="
                                                mb-2
                                                flex
                                                justify-between
                                                text-sm
                                            "
                                        >

                                            <p>{name}</p>

                                            <p
                                                className="
                                                    text-zinc-500
                                                "
                                            >
                                                {progress}%
                                            </p>

                                        </div>



                                        <div
                                            className="
                                                h-2
                                                overflow-hidden
                                                rounded-full
                                                bg-white/10
                                            "
                                        >

                                            <div
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                                className="
                                                    h-full
                                                    rounded-full
                                                    bg-linear-to-r
                                                    from-red-500
                                                    to-orange-500
                                                "
                                            />

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    </div>



                    {/* SUGGESTED BUILDERS */}

                    <div
                        className="
                            rounded-3xl
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
                            "
                        >

                            <TrendingUp
                                size={18}
                                className="text-orange-500"
                            />

                            <h2 className="font-semibold">
                                Suggested Builders
                            </h2>

                        </div>



                        <div
                            className="
                                mt-6
                                space-y-5
                            "
                        >

                            {
                                suggestedBuilders.map((builder) => (

                                    <div
                                        key={builder.username}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div>

                                            <p className="font-medium">
                                                {builder.name}
                                            </p>

                                            <p
                                                className="
                                                    text-xs
                                                    text-zinc-500
                                                "
                                            >
                                                {builder.stack}
                                            </p>

                                        </div>



                                        <button
                                            className="
                                                rounded-full
                                                border
                                                border-orange-500/20
                                                bg-orange-500/10
                                                px-4
                                                py-2
                                                text-sm
                                                text-orange-400
                                                transition-all
                                                hover:bg-orange-500/20
                                            "
                                        >
                                            Follow
                                        </button>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                </div>

            </aside>



            {/* FULLSCREEN AVATAR VIEWER */}

            {
                showAvatarViewer &&
                avatarUrl && (

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
                                src={avatarUrl}
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
                bannerUrl && (

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
                                max-w-6xl
                                overflow-hidden
                                rounded-3xl
                            "
                        >

                            <Image
                                src={bannerUrl}
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