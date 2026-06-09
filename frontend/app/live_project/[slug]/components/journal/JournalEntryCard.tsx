"use client";

import {
    CalendarDays,
    Code2,
    ImageIcon,
    MessageCircle,
    Rocket,
} from "lucide-react";

import type {
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject";

interface JournalEntryCardProps {
    journal: GetLiveProjectJournal;
}

function formatDate(date: string) {
    try {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return date;
    }
}

export default function JournalEntryCard({
    journal,
}: JournalEntryCardProps) {
    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                p-5
                shadow-[0_0_40px_rgba(0,0,0,0.25)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-orange-500/30
                hover:bg-white/5.5
                hover:shadow-[0_0_55px_rgba(249,115,22,0.10)]
            "
        >
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
                {/* TOP META */}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-orange-200
                            "
                        >
                            <Rocket size={13} />
                            Day {journal.day_number}
                        </span>

                        <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/4
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                capitalize
                                text-zinc-300
                            "
                        >
                            {journal.entry_type}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <CalendarDays size={13} />
                        {formatDate(journal.created_at)}
                    </div>
                </div>

                {/* TITLE */}

                {journal.title && (
                    <h3 className="text-lg font-black tracking-[-0.03em] text-white">
                        {journal.title}
                    </h3>
                )}

                {/* CONTENT */}

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                    {journal.content}
                </p>

                {/* CODE SNIPPET */}

                {journal.code_snippet && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                        <div className="flex items-center gap-2 border-b border-white/10 bg-white/3 px-4 py-3 text-xs font-bold text-zinc-400">
                            <Code2 size={14} />
                            Code snippet
                        </div>

                        <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-300">
                            <code>{journal.code_snippet}</code>
                        </pre>
                    </div>
                )}

                {/* IMAGES */}

                {journal.images && journal.images.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {journal.images.map((imageUrl, index) => (
                            <div
                                key={`${imageUrl}-${index}`}
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                "
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Journal image ${index + 1}`}
                                    className="h-40 w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* FOOTER */}

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
                    {journal.images && journal.images.length > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                            <ImageIcon size={13} />
                            {journal.images.length} image
                            {journal.images.length > 1 ? "s" : ""}
                        </span>
                    )}

                    <span className="inline-flex items-center gap-1.5">
                        <MessageCircle size={13} />
                        {journal.comments_count ?? 0} comments
                    </span>
                </div>
            </div>
        </article>
    );
}