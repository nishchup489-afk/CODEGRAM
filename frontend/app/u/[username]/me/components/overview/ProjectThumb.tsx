import Image from "next/image"

const PALETTES = [
    { bg: "#DDF3E6", dot: "#9ED9B8" },
    { bg: "#E0ECFE", dot: "#9EC0F8" },
    { bg: "#F1E6FD", dot: "#CDA9F4" },
    { bg: "#FFF1D6", dot: "#F5CC7A" },
    { bg: "#FFE7DB", dot: "#F7B08E" },
]

function hash(value: string) {
    let h = 0
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
    return Math.abs(h)
}

export default function ProjectThumb({
    seed,
    src,
    size = "md",
}: {
    seed: string
    src?: string | null
    size?: "md" | "lg"
}) {
    const box = size === "lg" ? "h-11 w-11 rounded-lg" : "h-11 w-11 rounded-md"
    if (src) {
        return (
            <span className={`relative block shrink-0 overflow-hidden bg-[#F3F4F6] ${box}`}>
                <Image src={src} alt="" fill sizes="44px" className="object-cover" />
            </span>
        )
    }
    const palette = PALETTES[hash(seed) % PALETTES.length]
    return (
        <span
            aria-hidden="true"
            className={`block shrink-0 ${box}`}
            style={{
                backgroundColor: palette.bg,
                backgroundImage: `radial-gradient(${palette.dot} 1.5px, transparent 1.6px)`,
                backgroundSize: "7px 7px",
            }}
        />
    )
}
