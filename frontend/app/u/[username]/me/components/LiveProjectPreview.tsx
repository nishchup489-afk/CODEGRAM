"use client"

export default function LiveProjectsPreview() {
    return (
        <div className="space-y-4">

            {
                Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <div className="h-5 w-48 rounded bg-zinc-800 animate-pulse" />

                                <div className="mt-3 h-4 w-64 rounded bg-zinc-800 animate-pulse" />

                            </div>

                            <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                                Building
                            </div>

                        </div>

                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-800">

                            <div className="h-full w-[45%] bg-orange-500" />

                        </div>

                    </div>
                ))
            }

        </div>
    )
}