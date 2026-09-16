"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import api from "./api"



import type { CurrentUser } from "./type/currentUser"



export default function useCurrentUser() {

    const { user, isLoaded } = useUser()

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    const [currentUser, setCurrentUser] =
        useState<CurrentUser | null>(null)



    useEffect(() => {

        if (!isLoaded) return

        if (!user?.id) {
            return
        }

        let cancelled = false

        const fetchCurrentUser = async () => {

            try {

                setLoading(true)

                setError("")

                const result = await api.get("/profile/me")

                if (!cancelled) setCurrentUser(result.data)

            } catch (err) {

                console.error(err)

                if (!cancelled) {
                    setCurrentUser(null)
                    setError(
                        "There was a problem loading current user"
                    )
                }

            } finally {

                if (!cancelled) setLoading(false)

            }

        }

        void fetchCurrentUser()

        return () => {
            cancelled = true
        }

    }, [isLoaded, user?.id])



    const activeCurrentUser = user?.id && currentUser?.clerk_user_id === user.id
        ? currentUser
        : null

    return {
        currentUser: activeCurrentUser,
        loading: !isLoaded || Boolean(user?.id && loading),
        error: user?.id ? error : "",
    }
}
