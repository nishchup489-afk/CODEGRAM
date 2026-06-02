"use client"

import { Sparkles } from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"

import JournalEntryCard
from "./JournalEntryCard"

import type {
    GetLiveProjectJournal
} from "../../types/liveProject"



interface JournalTimelineProps {

    journals: GetLiveProjectJournal[]

}



export default function JournalTimeline({

    journals,

}: JournalTimelineProps) {



    return (

        <div
            className="
                relative
                flex
                flex-col
                gap-8
            "
        >

            {/* TIMELINE LINE */}

            <div
                className="
                    absolute
                    left-5.75
                    top-0
                    hidden
                    h-full
                    w-0.5
                    bg-linear-to-b
                    from-orange-500/40
                    via-orange-500/10
                    to-transparent
                    md:block
                "
            />



            {journals.map((entry, index) => (

                <RevealWrapper
                    key={entry.id}
                    delay={index * 0.04}
                >

                    <div
                        className="
                            relative
                            flex
                            gap-6
                        "
                    >

                        {/* NODE */}

                        <div
                            className="
                                relative
                                z-10
                                hidden
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-300
                                shadow-[0_0_30px_rgba(249,115,22,0.25)]
                                backdrop-blur-xl
                                md:flex
                            "
                        >

                            {/* PULSE */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    animate-ping
                                    rounded-full
                                    bg-orange-500/10
                                "
                            />



                            <Sparkles
                                size={18}
                                className="relative z-10"
                            />

                        </div>



                        {/* ENTRY */}

                        <div className="flex-1">

                            <JournalEntryCard
                                entry={entry}
                            />

                        </div>

                    </div>

                </RevealWrapper>

            ))}

        </div>

    )
}