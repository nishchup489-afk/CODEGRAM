"use client"

interface StackData {

    tech: string

    level: number

    score: number

    projects: number

    logs: number

    last_used: string

}

const stacks: StackData[] = [

    {
        tech: "Python",
        level: 7,
        score: 78,
        projects: 12,
        logs: 48,
        last_used: "Today",
    },

    {
        tech: "FastAPI",
        level: 5,
        score: 61,
        projects: 8,
        logs: 26,
        last_used: "2d ago",
    },

]

export default function StacksAnalytics() {

    return (

        <div className="grid gap-4 md:grid-cols-2">

            {stacks.map((stack) => (

                <div
                    key={stack.tech}
                    className="
                        rounded-3xl
                        border
                        border-zinc-800
                        bg-[#0d0d0d]
                        p-5
                    "
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <h3
                                className="
                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                {stack.tech}
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Level {stack.level} Builder
                            </p>

                        </div>

                        <div
                            className="
                                rounded-full
                                bg-orange-500/10
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-orange-300
                            "
                        >
                            {stack.score} XP
                        </div>

                    </div>



                    <div
                        className="
                            mt-5
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-zinc-900
                        "
                    >

                        <div
                            className="
                                h-full
                                rounded-full
                                bg-orange-500
                            "
                            style={{
                                width:
                                    `${stack.score}%`,
                            }}
                        />

                    </div>



                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            text-sm
                            text-zinc-400
                        "
                    >

                        <span>
                            {stack.projects} projects
                        </span>

                        <span>
                            {stack.logs} logs
                        </span>

                        <span>
                            {stack.last_used}
                        </span>

                    </div>

                </div>

            ))}

        </div>

    )

}