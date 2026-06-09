"use client";

import { useState } from "react";
import Image from "next/image";

import {
    Coffee,
    QrCode,
    X,
    Copy,
    Check,
    ExternalLink,
    Heart,
} from "lucide-react";

type BuyMeCoffeeVariant = "button" | "compact" | "card";

type BuyMeCoffeeProps = {
    username?: string;
    coffeeUrl?: string;
    qrImageSrc?: string;
    variant?: BuyMeCoffeeVariant;
    showQr?: boolean;
    showOfficialButton?: boolean;
    title?: string;
    description?: string;
    className?: string;
};

export default function BuyMeCoffee({
    username = "nish489",
    coffeeUrl,
    qrImageSrc = "/coffeeqr.svg",
    variant = "button",
    showQr = true,
    showOfficialButton = true,
    title = "Support the build",
    description = "If my work helped you, you can support the journey with a coffee.",
    className = "",
}: BuyMeCoffeeProps) {
    const [qrOpen, setQrOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const finalCoffeeUrl =
        coffeeUrl || `https://www.buymeacoffee.com/${username}`;

    const officialButtonImageUrl = `https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=${username}&button_colour=e8a411&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(finalCoffeeUrl);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1400);
        } catch {
            setCopied(false);
        }
    };

    if (variant === "compact") {
        return (
            <>
                <div className={`flex items-center gap-2 ${className}`}>
                    <a
                        href={finalCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex items-center gap-2 rounded-full
                            border border-orange-500/30
                            bg-orange-500/10 px-4 py-2
                            text-sm font-semibold text-orange-100
                            transition-all duration-300
                            hover:-translate-y-0.5
                            hover:border-orange-400/60
                            hover:bg-orange-500/20
                            hover:shadow-[0_0_28px_rgba(249,115,22,0.18)]
                        "
                    >
                        <Coffee className="h-4 w-4" />
                        Support
                    </a>

                    {showQr && (
                        <button
                            type="button"
                            onClick={() => setQrOpen(true)}
                            className="
                                inline-flex h-10 w-10 items-center justify-center
                                rounded-full border border-white/10
                                bg-white/4 text-zinc-300
                                transition-all duration-300
                                hover:border-orange-400/50
                                hover:text-orange-200
                            "
                            aria-label="Show Buy Me a Coffee QR code"
                        >
                            <QrCode className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <CoffeeQrModal
                    open={qrOpen}
                    onClose={() => setQrOpen(false)}
                    coffeeUrl={finalCoffeeUrl}
                    qrImageSrc={qrImageSrc}
                    copied={copied}
                    onCopy={handleCopy}
                />
            </>
        );
    }

    if (variant === "card") {
        return (
            <>
                <section
                    className={`
                        relative overflow-hidden rounded-3xl
                        border border-orange-500/20 bg-[#0b0b0b]
                        p-5 sm:p-6
                        shadow-[0_0_70px_rgba(249,115,22,0.08)]
                        ${className}
                    `}
                >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl" />

                    <div className="relative z-10">
                        <div
                            className="
                                mb-4 inline-flex items-center gap-2 rounded-full
                                border border-orange-400/20 bg-orange-500/10
                                px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]
                                text-orange-200
                            "
                        >
                            <Heart className="h-3.5 w-3.5" />
                            Creator support
                        </div>

                        <h3 className="text-xl font-black text-white sm:text-2xl">
                            {title}
                        </h3>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                            {description}
                        </p>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                            {showOfficialButton ? (
                                <a
                                    href={finalCoffeeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        inline-flex w-fit transition-all duration-300
                                        hover:-translate-y-0.5
                                        hover:drop-shadow-[0_0_20px_rgba(232,164,17,0.35)]
                                    "
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={officialButtonImageUrl}
                                        alt="Buy me a coffee"
                                        className="h-12 w-auto rounded-xl"
                                    />
                                </a>
                            ) : (
                                <a
                                    href={finalCoffeeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        inline-flex items-center justify-center gap-2
                                        rounded-full bg-[#e8a411]
                                        px-5 py-3 text-sm font-extrabold text-black
                                        transition-all duration-300
                                        hover:-translate-y-0.5
                                        hover:shadow-[0_0_35px_rgba(232,164,17,0.35)]
                                    "
                                >
                                    <Coffee className="h-4 w-4" />
                                    Buy me a coffee
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}

                            {showQr && (
                                <button
                                    type="button"
                                    onClick={() => setQrOpen(true)}
                                    className="
                                        inline-flex items-center justify-center gap-2
                                        rounded-full border border-white/10
                                        bg-white/4 px-5 py-3
                                        text-sm font-semibold text-zinc-200
                                        transition-all duration-300
                                        hover:-translate-y-0.5
                                        hover:border-orange-400/50
                                        hover:bg-orange-500/10
                                        hover:text-orange-100
                                    "
                                >
                                    <QrCode className="h-4 w-4" />
                                    Show QR
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <CoffeeQrModal
                    open={qrOpen}
                    onClose={() => setQrOpen(false)}
                    coffeeUrl={finalCoffeeUrl}
                    qrImageSrc={qrImageSrc}
                    copied={copied}
                    onCopy={handleCopy}
                />
            </>
        );
    }

    return (
        <>
            <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}>
                {showOfficialButton ? (
                    <a
                        href={finalCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex w-fit transition-all duration-300
                            hover:-translate-y-0.5
                            hover:drop-shadow-[0_0_20px_rgba(232,164,17,0.35)]
                        "
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={officialButtonImageUrl}
                            alt="Buy me a coffee"
                            className="h-12 w-auto rounded-xl"
                        />
                    </a>
                ) : (
                    <a
                        href={finalCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex items-center justify-center gap-2
                            rounded-full bg-[#e8a411]
                            px-5 py-3 text-sm font-extrabold text-black
                            transition-all duration-300
                            hover:-translate-y-0.5
                            hover:shadow-[0_0_35px_rgba(232,164,17,0.35)]
                        "
                    >
                        <Coffee className="h-4 w-4" />
                        Buy me a coffee
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}

                {showQr && (
                    <button
                        type="button"
                        onClick={() => setQrOpen(true)}
                        className="
                            inline-flex items-center justify-center gap-2
                            rounded-full border border-white/10
                            bg-white/4 px-5 py-3
                            text-sm font-semibold text-zinc-200
                            transition-all duration-300
                            hover:-translate-y-0.5
                            hover:border-orange-400/50
                            hover:bg-orange-500/10
                            hover:text-orange-100
                        "
                    >
                        <QrCode className="h-4 w-4" />
                        QR code
                    </button>
                )}
            </div>

            <CoffeeQrModal
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                coffeeUrl={finalCoffeeUrl}
                qrImageSrc={qrImageSrc}
                copied={copied}
                onCopy={handleCopy}
            />
        </>
    );
}

type CoffeeQrModalProps = {
    open: boolean;
    onClose: () => void;
    coffeeUrl: string;
    qrImageSrc: string;
    copied: boolean;
    onCopy: () => void;
};

function CoffeeQrModal({
    open,
    onClose,
    coffeeUrl,
    qrImageSrc,
    copied,
    onCopy,
}: CoffeeQrModalProps) {
    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-9999 flex items-center justify-center
                bg-black/75 px-4 backdrop-blur-md
            "
            onClick={onClose}
        >
            <div
                className="
                    relative w-full max-w-sm overflow-hidden
                    rounded-3xl border border-orange-500/20
                    bg-[#080808] p-5
                    shadow-[0_0_90px_rgba(249,115,22,0.18)]
                "
                onClick={(event) => event.stopPropagation()}
            >
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl" />

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        absolute right-4 top-4 z-20
                        inline-flex h-9 w-9 items-center justify-center
                        rounded-full border border-white/10
                        bg-white/4 text-zinc-400
                        transition-all duration-300
                        hover:border-red-400/40
                        hover:text-red-300
                    "
                    aria-label="Close QR modal"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="relative z-10">
                    <div
                        className="
                            mb-4 inline-flex items-center gap-2
                            rounded-full border border-orange-400/20
                            bg-orange-500/10 px-3 py-1
                            text-xs font-bold uppercase tracking-[0.18em]
                            text-orange-200
                        "
                    >
                        <Coffee className="h-3.5 w-3.5" />
                        Buy Me a Coffee
                    </div>

                    <h3 className="text-xl font-black text-white">
                        Scan to support ☕
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Open your phone camera, scan the QR code, and it will
                        take you to the support page.
                    </p>

                    <div
                        className="
                            mt-5 overflow-hidden rounded-3xl
                            border border-white/10 bg-white p-4
                        "
                    >
                        <Image
                            src={qrImageSrc}
                            alt="Buy Me a Coffee QR code"
                            width={420}
                            height={420}
                            className="h-auto w-full rounded-2xl object-cover"
                            priority={false}
                        />
                    </div>

                    <div
                        className="
                            mt-4 overflow-hidden rounded-2xl
                            border border-white/10 bg-white/4
                            px-3 py-3
                        "
                    >
                        <p className="truncate text-xs text-zinc-400">
                            {coffeeUrl}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onCopy}
                            className="
                                inline-flex items-center justify-center gap-2
                                rounded-full border border-white/10
                                bg-white/4 px-4 py-3
                                text-sm font-semibold text-zinc-200
                                transition-all duration-300
                                hover:border-orange-400/50
                                hover:bg-orange-500/10
                                hover:text-orange-100
                            "
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </button>

                        <a
                            href={coffeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                inline-flex items-center justify-center gap-2
                                rounded-full bg-[#e8a411]
                                px-4 py-3
                                text-sm font-extrabold text-black
                                transition-all duration-300
                                hover:-translate-y-0.5
                                hover:shadow-[0_0_30px_rgba(232,164,17,0.35)]
                            "
                        >
                            Open
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}