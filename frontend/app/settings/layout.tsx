'use client'

import Link from 'next/link'

import {
    usePathname,
    useRouter,
} from 'next/navigation'

import {
    User,
    Shield,
    Lock,
    Github,
    LifeBuoy,
    MessageSquareMore,
    Info,
    ArrowLeft,
    Menu,
    X,
} from 'lucide-react'

import { useState } from 'react'

const settingsNavigation = [

    {
        section: 'SETTINGS',
        items: [
            {
                name: 'Profile',
                href: '/settings/profile',
                icon: User,
            },
            {
                name: 'Account',
                href: '/settings/account',
                icon: Shield,
            },
            {
                name: 'Privacy',
                href: '/settings/privacy',
                icon: Lock,
            },
            {
                name: 'GitHub',
                href: '/settings/github',
                icon: Github,
            },
        ],
    },

    {
        section: 'PLATFORM',
        items: [
            {
                name: 'Support',
                href: '/settings/support',
                icon: LifeBuoy,
            },
            {
                name: 'Feedback',
                href: '/settings/feedback',
                icon: MessageSquareMore,
            },
            {
                name: 'About',
                href: '/settings/about',
                icon: Info,
            },
        ],
    },

]

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const pathname = usePathname()

    const router = useRouter()

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false)

    return (

        <div className='min-h-screen bg-black text-white'>

            {/* MOBILE TOPBAR */}

            <div className='sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl lg:hidden'>

                <div className='flex items-center justify-between px-4 py-4'>

                    <div className='flex items-center gap-3'>

                        <button
                            onClick={() => router.back()}
                            className='rounded-xl border border-white/10 p-2 transition hover:bg-white/10'
                        >

                            <ArrowLeft size={18} />

                        </button>

                        <div>

                            <h1 className='text-lg font-semibold'>
                                Settings
                            </h1>

                            <p className='text-xs text-zinc-500'>
                                Manage your Codegram account
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={() =>
                            setMobileSidebarOpen(
                                !mobileSidebarOpen
                            )
                        }
                        className='rounded-xl border border-white/10 p-2 transition hover:bg-white/10'
                    >

                        {
                            mobileSidebarOpen
                                ? <X size={20} />
                                : <Menu size={20} />
                        }

                    </button>

                </div>

            </div>

            <div className='mx-auto flex max-w-7xl'>

                {/* SIDEBAR */}

                <aside className={`

                    fixed inset-y-0 left-0 z-40
                    w-[280px]
                    border-r border-white/10
                    bg-[#0a0a0a]
                    transition-transform duration-300

                    lg:sticky lg:top-0 lg:h-screen

                    ${mobileSidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0'
                    }

                `}>

                    <div className='flex h-full flex-col'>

                        {/* HEADER */}

                        <div className='border-b border-white/10 p-6'>

                            <button
                                onClick={() => router.back()}
                                className='mb-5 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white'
                            >

                                <ArrowLeft size={16} />

                                Back

                            </button>

                            <h1 className='text-2xl font-bold tracking-tight'>
                                Settings
                            </h1>

                            <p className='mt-2 text-sm text-zinc-500'>
                                Customize your Codegram experience.
                            </p>

                        </div>

                        {/* NAVIGATION */}

                        <nav className='flex-1 overflow-y-auto px-4 py-5'>

                            <div className='space-y-8'>

                                {
                                    settingsNavigation.map((section) => (

                                        <div
                                            key={section.section}
                                        >

                                            {/* SECTION LABEL */}

                                            <p className='mb-3 px-3 text-xs font-semibold tracking-[0.2em] text-zinc-600'>

                                                {section.section}

                                            </p>

                                            {/* ITEMS */}

                                            <div className='space-y-2'>

                                                {
                                                    section.items.map((item) => {

                                                        const isActive =
                                                            pathname === item.href

                                                        const Icon =
                                                            item.icon

                                                        return (

                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                onClick={() =>
                                                                    setMobileSidebarOpen(false)
                                                                }
                                                                className={`

                                                                    group flex items-center gap-3
                                                                    rounded-2xl px-4 py-3
                                                                    transition-all duration-200

                                                                    ${isActive
                                                                        ? 'bg-white text-black'
                                                                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                                                                    }

                                                                `}
                                                            >

                                                                <Icon
                                                                    size={20}
                                                                    className='shrink-0'
                                                                />

                                                                <span className='text-sm font-medium'>
                                                                    {item.name}
                                                                </span>

                                                            </Link>

                                                        )
                                                    })
                                                }

                                            </div>

                                        </div>

                                    ))
                                }

                            </div>

                        </nav>

                        {/* FOOTER */}

                        <div className='border-t border-white/10 p-4'>

                            <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>

                                <p className='text-sm font-semibold'>
                                    Codegram
                                </p>

                                <p className='mt-1 text-xs leading-relaxed text-zinc-500'>
                                    Developer-first social platform built for builders.
                                </p>

                            </div>

                        </div>

                    </div>

                </aside>

                {/* MOBILE OVERLAY */}

                {
                    mobileSidebarOpen && (

                        <div
                            onClick={() =>
                                setMobileSidebarOpen(false)
                            }
                            className='fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden'
                        />

                    )
                }

                {/* CONTENT */}

                <main className='min-h-screen flex-1'>

                    <div className='mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-10'>

                        {/* DESKTOP HEADER */}

                        <div className='mb-8 hidden lg:block'>

                            <h1 className='text-3xl font-bold tracking-tight'>
                                Settings
                            </h1>

                            <p className='mt-2 text-sm text-zinc-500'>
                                Manage your account, integrations, and platform preferences.
                            </p>

                        </div>

                        {/* CONTENT CARD */}

                        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8'>

                            {children}

                        </div>

                    </div>

                </main>

            </div>

        </div>

    )
}