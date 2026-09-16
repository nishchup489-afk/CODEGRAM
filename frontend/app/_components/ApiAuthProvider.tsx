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
    const { getToken, isLoaded, userId } = useAuth()

    useEffect(() => {
        if (!isLoaded || !userId) {
            return setAuthTokenProvider(null)
        }

        return setAuthTokenProvider(() => getToken())
    }, [getToken, isLoaded, userId])

    return children
}
