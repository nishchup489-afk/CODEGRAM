"use client"

export default function ProjectsPreview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {
                Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 transition-all hover:border-orange-500/40"
                    >

                        <div className="h-40 bg-zinc-800 animate-pulse" />

                        <div className="p-5">

                            <div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" />

                            <div className="mt-3 h-4 w-full rounded bg-zinc-800 animate-pulse" />

                            <div className="mt-2 h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />

                            <div className="mt-5 flex flex-wrap gap-2">

                                <div className="h-7 w-20 rounded-full bg-zinc-800 animate-pulse" />

                                <div className="h-7 w-16 rounded-full bg-zinc-800 animate-pulse" />

                                <div className="h-7 w-24 rounded-full bg-zinc-800 animate-pulse" />

                            </div>

                        </div>

                    </div>
                ))
            }

        </div>
    )
}