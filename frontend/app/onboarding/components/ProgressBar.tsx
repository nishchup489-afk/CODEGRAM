'use client'

interface ProgressBarProps {
    step: number
}

export default function ProgressBar({
    step,
}: ProgressBarProps) {

    return (

        <div className="space-y-4">

            {/* TOP LABELS */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.18em]
                "
            >

                <div
                    className={
                        step >= 1
                            ? 'text-orange-400'
                            : 'text-zinc-600'
                    }
                >
                    Identity
                </div>

                <div
                    className={
                        step >= 2
                            ? 'text-orange-400'
                            : 'text-zinc-600'
                    }
                >
                    Visuals
                </div>

                <div
                    className={
                        step >= 3
                            ? 'text-orange-400'
                            : 'text-zinc-600'
                    }
                >
                    Socials
                </div>

            </div>


            {/* BAR */}

            <div
                className="
                    relative
                    h-3
                    overflow-hidden
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    backdrop-blur-xl
                "
            >

                {/* ACTIVE FILL */}

                <div
                    className={`
                        absolute
                        left-0
                        top-0
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-red-500
                        via-orange-400
                        to-red-600
                        transition-all
                        duration-500
                        ease-out

                        ${
                            step === 1
                                ? 'w-1/3'
                                : step === 2
                                ? 'w-2/3'
                                : 'w-full'
                        }
                    `}
                />


                {/* GLOW */}

                <div
                    className={`
                        absolute
                        top-0
                        h-full
                        w-24
                        blur-xl
                        bg-orange-400/40
                        transition-all
                        duration-500

                        ${
                            step === 1
                                ? 'left-[20%]'
                                : step === 2
                                ? 'left-[55%]'
                                : 'left-[88%]'
                        }
                    `}
                />

            </div>


            {/* STEP TEXT */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    text-sm
                    text-zinc-500
                "
            >

                <p>
                    Step {step} of 3
                </p>

                <p>
                    {
                        step === 1
                            ? 'Create your identity'
                            : step === 2
                            ? 'Customize your visuals'
                            : 'Connect your developer graph'
                    }
                </p>

            </div>

        </div>
    )
}