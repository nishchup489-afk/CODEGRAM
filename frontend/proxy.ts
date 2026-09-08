import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

/**
 * Temporary maintenance mode.
 *
 * Toggle with the MAINTENANCE_MODE env var on Vercel (Production).
 * While it is 'true' every matched route is rewritten to the static page in
 * public/, so the app never renders and never calls the backend API — the
 * backend can stay switched off.
 *
 * This must match the filename in public/ exactly.
 */
const MAINTENANCE_PAGE = '/maintenance.html'

/**
 * Paths that keep working while maintenance mode is on. The maintenance page
 * collects early-access emails, so its endpoint must not be rewritten to the
 * page that calls it.
 */
const MAINTENANCE_ALLOWLIST = ['/api/early-access']

const clerk = clerkMiddleware()

export default function proxy(
    request: NextRequest,
    event: NextFetchEvent,
) {
    // Checked before Clerk runs, so maintenance mode still works even if the
    // Clerk keys are missing or the auth service is unreachable.
    const allowed = MAINTENANCE_ALLOWLIST.some((path) =>
        request.nextUrl.pathname.startsWith(path),
    )

    if (process.env.MAINTENANCE_MODE === 'true' && !allowed) {
        const url = request.nextUrl.clone()

        url.pathname = MAINTENANCE_PAGE
        url.search = ''

        const response = NextResponse.rewrite(url)

        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        response.headers.set('Retry-After', '3600')

        return response
    }

    return clerk(request, event)
}

export const config = {
    matcher: [
        // Skip Next.js internals and static files (including the maintenance
        // page itself, so the rewrite above can't loop).
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/__clerk/(.*)',
    ],
}
