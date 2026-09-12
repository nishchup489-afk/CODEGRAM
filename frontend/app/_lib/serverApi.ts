import { auth } from "@clerk/nextjs/server"

/**
 * Server-side counterpart to `app/_lib/api.js`.
 *
 * The browser client reads its token from `window.Clerk`, so anything that
 * uses it has to run after hydration — which is why auth routing used to live
 * in `useEffect`s. This helper mints the same Clerk token from the request on
 * the server, so a Server Component can talk to the backend and act on the
 * answer (redirect, 404, render) before any HTML reaches the browser.
 */

const rawBackendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

function resolveBaseUrl(): string {
    const backendUrl = rawBackendUrl?.replace(/\/$/, "")

    if (!backendUrl) {
        throw new Error(
            "BACKEND_URL / NEXT_PUBLIC_BACKEND_URL is not set; the server cannot reach the API",
        )
    }

    return backendUrl.endsWith("/api/v1") ? backendUrl : `${backendUrl}/api/v1`
}

export class ServerApiError extends Error {
    readonly status: number
    readonly body: string

    constructor(status: number, body: string) {
        super(`Backend responded ${status}`)
        this.name = "ServerApiError"
        this.status = status
        this.body = body
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: unknown
    /** Milliseconds before the request is abandoned. Keeps a cold or dead
     *  backend from holding a page render open indefinitely. */
    timeoutMs?: number
}

export async function serverApi<T>(
    path: string,
    { method = "GET", body, timeoutMs = 10_000 }: RequestOptions = {},
): Promise<T> {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
        throw new ServerApiError(401, "No active Clerk session")
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(`${resolveBaseUrl()}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            // Per-user, auth-dependent data: never cache it between requests.
            cache: "no-store",
            signal: controller.signal,
        })

        if (!response.ok) {
            throw new ServerApiError(response.status, await response.text())
        }

        return (await response.json()) as T
    } finally {
        clearTimeout(timeout)
    }
}
