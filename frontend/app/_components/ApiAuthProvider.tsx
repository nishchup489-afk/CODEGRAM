"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

import { setAuthTokenProvider } from "@/app/_lib/api"

export default function ApiAuthProvider({
    children,
}: {
    children: ReactNode
}) {
    const { getToken, isLoaded } = useAuth()

    useEffect(() => {
        if (!isLoaded) {
            return setAuthTokenProvider(null)
        }

        return setAuthTokenProvider(() => getToken())
    }, [getToken, isLoaded])

    return children
}
