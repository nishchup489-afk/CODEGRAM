'use client'

import api from '../lib/api'

import { useState, useEffect } from 'react'

import { useUser } from '@clerk/nextjs'

import {
    Home,
    Compass,
    Bell,
    Bookmark,
    User,
    Settings,
    Search,
} from 'lucide-react'

import LeftSidebar from './components/LeftSideBar'
import RightSidebar from './components/RightSideBar'
import MobileBottomNav from './components/MobileBottomNav'
import FloatingCreateButton from './components/FloatingCreateButton'



type CurrentUser = {

    avatar_url: string | null

    display_name: string

    username: string

    banner_url: string | null
}



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { user } = useUser()



    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")



    const [currentUser, setCurrentUser] =
        useState<CurrentUser>({

            avatar_url: null,

            display_name: "",

            username: "",

            banner_url: null
        })



    const navItems = [

        {
            name: 'Feed',
            href: '/dashboard/feed',
            icon: Home,
        },

        {
            name: 'Explore',
            href: '/dashboard/explore',
            icon: Compass,
        },

        {
            name: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
        },

        {
            name: 'Bookmarks',
            href: '/dashboard/bookmarks',
            icon: Bookmark,
        },

        {
            name: 'Profile',
            href: `/dashboard/u/${currentUser.username}`,
            icon: User,
        },

        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
        },
    ]



    useEffect(() => {

        if (!user?.id) return



        const fetchCurrentUser = async () => {

            try {

                setLoading(true)

                setError("")



                const result = await api.get(
                    `/dashboard?clerk_user_id=${user.id}`
                )



                setCurrentUser(result.data)

            } catch (err) {

                console.error(err)

                setError(
                    "There was a problem loading dashboard data"
                )

            } finally {

                setLoading(false)

            }

        }



        fetchCurrentUser()

    }, [user?.id])



    const suggestedBuilders = [

        {
            name: 'Tyler',
            username: '@tyler',
            stack: 'Python • Rust',
        },

        {
            name: 'Sara',
            username: '@sara',
            stack: 'React • Go',
        },

        {
            name: 'DevK',
            username: '@devk',
            stack: 'Next.js • Supabase',
        },
    ]



    return (

        <div
            className="
                flex
                min-h-screen
                bg-[#050505]
                text-white
            "
        >


            {/* LEFT SIDEBAR */}

            <LeftSidebar
                navItems={navItems}
                avatarUrl={
                    loading
                    ? null
                    : currentUser.avatar_url
                }
                displayName={
                    loading
                    ? "Loading..."
                    : currentUser.display_name
                }
                username={
                    loading
                    ? "loading"
                    : currentUser.username
                }
            />



            {/* MAIN */}

            <main
                className="
                    min-w-0
                    flex-1
                    border-r
                    border-white/10
                    pb-24
                    md:pb-0
                "
            >


                {/* MOBILE TOPBAR */}

                <div
                    className="
                        sticky
                        top-0
                        z-40
                        border-b
                        border-white/10
                        bg-black/80
                        backdrop-blur-xl
                        md:hidden
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            px-4
                            py-4
                        "
                    >

                        <h1
                            className="
                                bg-linear-to-r
                                from-red-500
                                to-orange-400
                                bg-clip-text
                                text-2xl
                                font-black
                                tracking-[-0.08em]
                                text-transparent
                            "
                        >
                            CODEGRAM
                        </h1>



                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <button
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/4
                                "
                            >

                                <Search size={18} />

                            </button>



                            <button
                                className="
                                    relative
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/4
                                "
                            >

                                <Bell size={18} />



                                <div
                                    className="
                                        absolute
                                        right-2
                                        top-2
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-orange-500
                                    "
                                />

                            </button>

                        </div>

                    </div>

                </div>



                {/* ERROR */}

                {
                    error && (

                        <div
                            className="
                                border-b
                                border-red-500/20
                                bg-red-500/10
                                px-4
                                py-3
                                text-sm
                                text-red-400
                            "
                        >
                            {error}
                        </div>

                    )
                }



                {/* PAGE CONTENT */}

                {children}

            </main>



            {/* RIGHT SIDEBAR */}

            <RightSidebar
                avatarUrl={
                    loading
                    ? null
                    : currentUser.avatar_url
                }
                displayName={
                    loading
                    ? "Loading..."
                    : currentUser.display_name
                }
                username={
                    loading
                    ? "loading"
                    : currentUser.username
                }
                bannerUrl={
                    loading
                    ? null
                    : currentUser.banner_url
                }
                suggestedBuilders={suggestedBuilders}
            />



            {/* MOBILE BOTTOM NAV */}

            <MobileBottomNav
                navItems={navItems}
                avatarUrl={
                    loading
                    ? null
                    : currentUser.avatar_url
                }
            />



            {/* FLOATING CREATE BUTTON */}

            <FloatingCreateButton
                onClick={() =>
                    console.log("Create Post")
                }
            />

        </div>

    )

}