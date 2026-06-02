'use client'

import {
    ArrowLeft,
    Github,
    Linkedin,
    Globe,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Code2,
} from 'lucide-react'

import { uploadToCloudinary } from '@/app/lib/cloudinary'


interface SocialStepProps {

    githubUrl: string
    setGithubUrl: React.Dispatch<React.SetStateAction<string>>

    linkedinUrl: string
    setLinkedinUrl: React.Dispatch<React.SetStateAction<string>>

    portfolioUrl: string
    setPortfolioUrl: React.Dispatch<React.SetStateAction<string>>

    onBack: () => void

    onSubmit: () => void

    loading: boolean
}


export default function SocialStep({

    githubUrl,
    setGithubUrl,

    linkedinUrl,
    setLinkedinUrl,

    portfolioUrl,
    setPortfolioUrl,

    onBack,

    onSubmit,

    loading,

}: SocialStepProps) {


    return (

        <div className="space-y-8">

            {/* HERO */}

            <div>

                <div
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-orange-500/20
                        bg-orange-500/10
                        px-4
                        py-2
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.2em]
                        text-orange-300
                    "
                >
                    <Sparkles size={14} />
                    Developer Graph
                </div>


                <h2
                    className="
                        mt-6
                        text-4xl
                        font-black
                        tracking-[-0.06em]
                        leading-tight
                    "
                >
                    Connect your
                    <span
                        className="
                            block
                            bg-gradient-to-r
                            from-red-500
                            via-orange-400
                            to-red-600
                            bg-clip-text
                            text-transparent
                        "
                    >
                        developer ecosystem.
                    </span>
                </h2>


                <p
                    className="
                        mt-5
                        max-w-xl
                        text-base
                        leading-8
                        text-zinc-400
                    "
                >
                    Showcase your GitHub,
                    portfolio, and professional
                    presence so people can explore
                    what you build.
                </p>

            </div>


            {/* TERMINAL PREVIEW */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-7
                    backdrop-blur-2xl
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-red-500/10
                        via-orange-500/5
                        to-transparent
                    "
                />


                <div className="relative">

                    {/* DOTS */}

                    <div className="flex gap-2">

                        <div className="h-3 w-3 rounded-full bg-red-500" />

                        <div className="h-3 w-3 rounded-full bg-yellow-500" />

                        <div className="h-3 w-3 rounded-full bg-green-500" />

                    </div>


                    {/* TERMINAL CONTENT */}

                    <div
                        className="
                            mt-8
                            space-y-5
                            font-mono
                            text-sm
                        "
                    >

                        <div className="flex items-center gap-3 text-zinc-500">

                            <ShieldCheck
                                size={16}
                                className="text-emerald-400"
                            />

                            profile integrity validated

                        </div>


                        <div className="flex items-center gap-3 text-zinc-500">

                            <Code2
                                size={16}
                                className="text-orange-400"
                            />

                            indexing developer links

                        </div>


                        <div className="flex items-center gap-3 text-orange-400">

                            <ArrowRight size={16} />

                            preparing DevManiac launch sequence

                        </div>

                    </div>

                </div>

            </div>


            {/* FORM */}

            <div className="space-y-6">

                {/* GITHUB */}

                <div>

                    <label
                        className="
                            mb-3
                            block
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        GitHub URL
                    </label>


                    <div className="relative">

                        <Github
                            className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                            "
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="https://github.com/username"
                            value={githubUrl}
                            onChange={(e) =>
                                setGithubUrl(e.target.value)
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.05]
                                pl-14
                                pr-5
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-500
                                focus:border-orange-500/40
                                focus:bg-white/[0.08]
                                focus:ring-4
                                focus:ring-orange-500/10
                            "
                        />

                    </div>

                </div>


                {/* GRID */}

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    "
                >

                    {/* LINKEDIN */}

                    <div>

                        <label
                            className="
                                mb-3
                                block
                                text-sm
                                font-medium
                                text-zinc-300
                            "
                        >
                            LinkedIn URL
                        </label>


                        <div className="relative">

                            <Linkedin
                                className="
                                    absolute
                                    left-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-500
                                "
                                size={18}
                            />


                            <input
                                type="text"
                                placeholder="linkedin.com/in/..."
                                value={linkedinUrl}
                                onChange={(e) =>
                                    setLinkedinUrl(e.target.value)
                                }
                                className="
                                    h-16
                                    w-full
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.05]
                                    pl-14
                                    pr-5
                                    text-white
                                    outline-none
                                    transition-all
                                    placeholder:text-zinc-500
                                    focus:border-orange-500/40
                                    focus:bg-white/[0.08]
                                    focus:ring-4
                                    focus:ring-orange-500/10
                                "
                            />

                        </div>

                    </div>


                    {/* PORTFOLIO */}

                    <div>

                        <label
                            className="
                                mb-3
                                block
                                text-sm
                                font-medium
                                text-zinc-300
                            "
                        >
                            Portfolio URL
                        </label>


                        <div className="relative">

                            <Globe
                                className="
                                    absolute
                                    left-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-500
                                "
                                size={18}
                            />


                            <input
                                type="text"
                                placeholder="yourportfolio.dev"
                                value={portfolioUrl}
                                onChange={(e) =>
                                    setPortfolioUrl(e.target.value)
                                }
                                className="
                                    h-16
                                    w-full
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.05]
                                    pl-14
                                    pr-5
                                    text-white
                                    outline-none
                                    transition-all
                                    placeholder:text-zinc-500
                                    focus:border-orange-500/40
                                    focus:bg-white/[0.08]
                                    focus:ring-4
                                    focus:ring-orange-500/10
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* OPTIONAL NOTE */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-5
                        py-4
                        text-sm
                        leading-7
                        text-zinc-500
                    "
                >
                    All fields here are optional.
                    You can always update your
                    developer profile later from
                    settings.
                </div>

            </div>


            {/* ACTIONS */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-4
                    pt-4
                    sm:flex-row
                "
            >

                {/* BACK */}

                <button
                    type="button"
                    onClick={onBack}
                    className="
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        text-lg
                        font-semibold
                        text-zinc-300
                        transition-all
                        hover:bg-white/[0.08]
                    "
                >

                    <ArrowLeft size={20} />

                    Back

                </button>


                {/* SUBMIT */}

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="
                        group
                        relative
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-red-500
                        via-orange-500
                        to-red-600
                        text-lg
                        font-bold
                        text-white
                        transition-all
                        hover:scale-[1.01]
                        hover:shadow-[0_0_60px_rgba(249,115,22,0.35)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {/* SHINE */}

                    <div
                        className="
                            absolute
                            inset-0
                            opacity-0
                            transition-opacity
                            duration-500
                            group-hover:opacity-100
                            bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)]
                            translate-x-[-200%]
                            group-hover:translate-x-[200%]
                        "
                    />

                    {
                        loading
                            ? 'Initializing profile...'
                            : 'Enter DevManiac'
                    }

                    {
                        !loading && (
                            <ArrowRight size={20} />
                        )
                    }

                </button>

            </div>

        </div>

    )
}