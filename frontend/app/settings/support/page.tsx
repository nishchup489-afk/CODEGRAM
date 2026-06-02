'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Mail,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Send,
    Loader2,
} from 'lucide-react'

type TicketStatus =
    | 'open'
    | 'in_progress'
    | 'waiting_on_user'
    | 'resolved'
    | 'closed'

type TicketCategory =
    | 'bug'
    | 'account'
    | 'integration'
    | 'feature_not_working'
    | 'other'

interface SupportTicket {
    id: string
    ticket_number: string
    subject: string
    status: TicketStatus
    category: TicketCategory
    created_at: string
    updated_at: string
}

const STATUS_META: Record<
    TicketStatus,
    {
        label: string
        color: string
        icon: typeof Clock
    }
> = {
    open: {
        label: 'Open',
        color: 'text-[#3B82F6]',
        icon: AlertCircle,
    },
    in_progress: {
        label: 'In progress',
        color: 'text-[#E8560A]',
        icon: Clock,
    },
    waiting_on_user: {
        label: 'Waiting on you',
        color: 'text-[#E8560A]',
        icon: AlertCircle,
    },
    resolved: {
        label: 'Resolved',
        color: 'text-[#16A34A]',
        icon: CheckCircle2,
    },
    closed: {
        label: 'Closed',
        color: 'text-[#9CA3AF]',
        icon: CheckCircle2,
    },
}

const FAQS = [
    {
        q: 'How does GitHub sync work?',
        a: 'Once you connect GitHub from Settings → GitHub, DevManiac can sync your selected repositories and connect them to your projects.',
    },
    {
        q: 'What counts as a shipped project?',
        a: 'A project is shipped when you mark it as complete or production-ready from the project page.',
    },
    {
        q: 'Can I make a project private?',
        a: 'Yes. Private projects will not appear publicly on your profile or in search.',
    },
    {
        q: 'How are my profile stats calculated?',
        a: 'Profile stats are based on your projects, activity, stars, and developer contributions.',
    },
    {
        q: 'How do I change my username?',
        a: 'Go to Settings → Profile. Username changes may be limited later to prevent abuse.',
    },
    {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Danger Zone. Deletion should require confirmation before becoming permanent.',
    },
]

export default function SupportPage() {
    const [openTicket, setOpenTicket] =
        useState<SupportTicket | null>(null)

    const [loadingTicket, setLoadingTicket] =
        useState(true)

    useEffect(() => {
        async function fetchOpenTicket() {
            try {
                const res = await fetch(
                    '/api/v1/support/tickets?status=open&limit=1'
                )

                if (!res.ok) {
                    throw new Error('Failed to fetch ticket')
                }

                const data: SupportTicket[] =
                    await res.json()

                setOpenTicket(data[0] ?? null)
            } catch {
                setOpenTicket(null)
            } finally {
                setLoadingTicket(false)
            }
        }

        fetchOpenTicket()
    }, [])

    return (
        <div className='mx-auto max-w-3xl space-y-16 px-6 py-12'>
            <header className='space-y-2'>
                <h1 className='text-5xl font-bold tracking-tight text-[#F9FAFB]'>
                    Support
                </h1>

                <p className='text-base text-[#9CA3AF]'>
                    Find an answer, reach the team, or report what&apos;s broken.
                </p>
            </header>

            <CurrentCaseSection
                ticket={openTicket}
                loading={loadingTicket}
            />

            <ReportSection />

            <FaqSection />

            <EscalationSection />

            <OtherSupportSection />
        </div>
    )
}

function CurrentCaseSection({
    ticket,
    loading,
}: {
    ticket: SupportTicket | null
    loading: boolean
}) {
    return (
        <section className='space-y-4'>
            <div className='flex items-baseline justify-between'>
                <h2 className='text-2xl font-semibold text-[#F9FAFB]'>
                    Your open case
                </h2>

                {ticket && (
                    <Link
                        href='/settings/support/tickets'
                        className='text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                    >
                        View all →
                    </Link>
                )}
            </div>

            {loading ? (
                <div className='rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-6'>
                    <div className='flex items-center gap-3 text-[#9CA3AF]'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        <span className='text-sm'>
                            Checking your tickets…
                        </span>
                    </div>
                </div>
            ) : ticket ? (
                <OpenTicketCard ticket={ticket} />
            ) : (
                <EmptyTicketState />
            )}
        </section>
    )
}

function OpenTicketCard({
    ticket,
}: {
    ticket: SupportTicket
}) {
    const meta = STATUS_META[ticket.status]
    const Icon = meta.icon

    return (
        <Link
            href={`/settings/support/tickets/${ticket.id}`}
            className='group block rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-6 transition-colors hover:border-[#E8560A]/40'
        >
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 space-y-2'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-[#9CA3AF]'>
                            {ticket.ticket_number}
                        </span>

                        <span className={`flex items-center gap-1.5 text-xs ${meta.color}`}>
                            <Icon className='h-3.5 w-3.5' />
                            {meta.label}
                        </span>
                    </div>

                    <h3 className='truncate font-medium text-[#F9FAFB] transition-colors group-hover:text-[#E8560A]'>
                        {ticket.subject}
                    </h3>

                    <p className='text-xs text-[#9CA3AF]'>
                        Opened {formatRelativeTime(ticket.created_at)}
                    </p>
                </div>

                <ChevronDown className='mt-1 h-4 w-4 shrink-0 -rotate-90 text-[#9CA3AF] transition-colors group-hover:text-[#E8560A]' />
            </div>
        </Link>
    )
}

function EmptyTicketState() {
    return (
        <div className='rounded-xl border border-dashed border-[#2D2D2D] bg-transparent p-6 text-center'>
            <CheckCircle2 className='mx-auto mb-2 h-5 w-5 text-[#16A34A]' />

            <p className='text-sm text-[#9CA3AF]'>
                You have no open cases. All clear.
            </p>
        </div>
    )
}

function ReportSection() {
    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Have a report?'
                description='Found a bug or hit a wall? Let us know.'
            />

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <Link
                    href='/settings/support/new'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='orange'>
                        <FileText className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Submit a report'
                        description='Structured form. Best for bugs and broken things.'
                    />
                </Link>

                <a
                    href='mailto:support@DevManiac.dev'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='blue'>
                        <Mail className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Email us'
                        description='Prefer freeform? Write to support@DevManiac.dev.'
                    />
                </a>
            </div>
        </section>
    )
}

function FaqSection() {
    const [openIndex, setOpenIndex] =
        useState<number | null>(null)

    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Frequently asked'
                description='Most answers live here.'
            />

            <div className='overflow-hidden rounded-xl border border-[#2D2D2D] bg-[#1C1C1E]'>
                {FAQS.map((faq, index) => {
                    const isOpen = openIndex === index
                    const isLast = index === FAQS.length - 1

                    return (
                        <div
                            key={faq.q}
                            className={!isLast ? 'border-b border-[#2D2D2D]' : ''}
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#0F0F0F]/40'
                            >
                                <span className='text-sm font-medium text-[#F9FAFB]'>
                                    {faq.q}
                                </span>

                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isOpen && (
                                <div className='px-5 pb-4 text-sm leading-relaxed text-[#9CA3AF]'>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

function EscalationSection() {
    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Not enough?'
                description='Two ways to dig deeper.'
            />

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <button
                    onClick={() => console.log('Open bot')}
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 text-left transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='orange'>
                        <Sparkles className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Ask our bot'
                        description='Searches docs, status, and past issues instantly.'
                    />
                </button>

                <a
                    href='mailto:support@DevManiac.dev'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='blue'>
                        <Send className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Email us'
                        description='We respond within 24 hours on weekdays.'
                    />
                </a>
            </div>
        </section>
    )
}

function OtherSupportSection() {
    const links = [
        {
            label: 'Documentation',
            href: 'https://docs.DevManiac.dev',
            external: true,
        },
        {
            label: 'Status page',
            href: 'https://status.DevManiac.dev',
            external: true,
        },
        {
            label: 'Changelog',
            href: '/changelog',
            external: false,
        },
        {
            label: 'Community Discord',
            href: 'https://discord.gg/DevManiac',
            external: true,
        },
    ]

    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Other resources'
                description="Self-serve options the docs don't cover."
            />

            <div className='overflow-hidden rounded-xl border border-[#2D2D2D] bg-[#1C1C1E]'>
                {links.map((link, index) => {
                    const className = `flex items-center justify-between px-5 py-4 text-sm text-[#F9FAFB] transition-colors hover:bg-[#0F0F0F]/40 hover:text-[#E8560A] ${
                        index !== links.length - 1
                            ? 'border-b border-[#2D2D2D]'
                            : ''
                    }`

                    if (link.external) {
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={className}
                            >
                                <span>{link.label}</span>
                                <ExternalLink className='h-4 w-4 text-[#9CA3AF]' />
                            </a>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={className}
                        >
                            <span>{link.label}</span>
                            <ChevronDown className='h-4 w-4 -rotate-90 text-[#9CA3AF]' />
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

function SectionTitle({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className='space-y-1'>
            <h2 className='text-2xl font-semibold text-[#F9FAFB]'>
                {title}
            </h2>

            <p className='text-sm text-[#9CA3AF]'>
                {description}
            </p>
        </div>
    )
}

function IconBox({
    children,
    variant,
}: {
    children: React.ReactNode
    variant: 'orange' | 'blue'
}) {
    const classes =
        variant === 'orange'
            ? 'bg-[#E8560A]/10 text-[#E8560A]'
            : 'bg-[#3B82F6]/10 text-[#3B82F6]'

    return (
        <div className={`shrink-0 rounded-lg p-2 ${classes}`}>
            {children}
        </div>
    )
}

function CardText({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className='space-y-1'>
            <h3 className='font-medium text-[#F9FAFB] transition-colors group-hover:text-[#E8560A]'>
                {title}
            </h3>

            <p className='text-xs text-[#9CA3AF]'>
                {description}
            </p>
        </div>
    )
}

function formatRelativeTime(iso: string): string {
    const now = new Date()
    const then = new Date(iso)

    const diffMs = now.getTime() - then.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return then.toLocaleDateString()
}