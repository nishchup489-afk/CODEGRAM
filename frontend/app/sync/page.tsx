import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { serverApi, ServerApiError } from "@/app/_lib/serverApi"

export const metadata: Metadata = {
    title: "Signing you in",
    robots: { index: false, follow: false },
}

// Every visit must hit the backend: the answer depends on the signed-in user
// and on onboarding state that changes between requests.
export const dynamic = "force-dynamic"

type SyncedUser = {
    username: string | null
    onboarding_completed: boolean
}

/**
 * Where a signed-in user actually belongs.
 *
 * This used to run in the browser: the page rendered, a `useEffect` posted to
 * the backend, waited out a hard-coded 2.5s, then pushed a route. That meant
 * the destination was decided by client code holding a token the client had to
 * fetch first, and any failure left the user parked on an animation with no
 * way forward.
 *
 * Now the request is made server-side with the session token minted from the
 * incoming request, and the redirect is a real HTTP redirect issued before the
 * page is sent. The middleware guarantees there is a session here, so the only
 * thing left to handle is the backend being unreachable.
 */
export default async function SyncUserPage() {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    const githubAccount = user.externalAccounts.find(
        (account) => account.provider === "github"
    )

    const githubUsername = githubAccount?.username ?? null

    const githubUrl = githubUsername
        ? `https://github.com/${githubUsername}`
        : null

    let synced: SyncedUser

    try {
        synced = await serverApi<SyncedUser>("/sync_user/", {
            method: "POST",
            body: {
                display_name: user.fullName,
                avatar_url: user.imageUrl,
                github_url: githubUrl,
                github_username: githubUsername,
                github_user_id: githubAccount?.providerUserId ?? null,
            },
        })
    } catch (error) {
        const { default: SyncStage } = await import("./SyncStage")

        const status = error instanceof ServerApiError ? error.status : 0

        console.error("[sync] backend sync failed", error)

        return (
            <SyncStage
                error={
                    status === 409
                        ? "That email is already linked to another account."
                        : "We could not reach your workspace. Please try again."
                }
            />
        )
    }

    // redirect() throws, so it must sit outside the try/catch above or it
    // would be swallowed and rendered as a sync failure.
    if (!synced.onboarding_completed || !synced.username) {
        redirect("/onboarding")
    }

    redirect(`/u/${synced.username}`)
}
