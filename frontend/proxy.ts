import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
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

/**
 * Routes that require a signed-in Clerk session.
 *
 * This is the single gate for authenticated areas. Before this existed the
 * pages themselves redirected from client `useEffect`s, so a signed-out
 * visitor still downloaded and rendered the page, fired API calls with no
 * token, and only then bounced — which showed up as flashes of empty UI and
 * 401 noise. Deciding here means the redirect happens before any HTML is
 * sent.
 */
const isProtectedRoute = createRouteMatcher([
    /^\/sync(?:\/.*)?$/,
    /^\/onboarding(?:\/.*)?$/,
    /^\/settings(?:\/.*)?$/,
    /^\/admin(?:\/.*)?$/,
    /^\/create(?:\/.*)?$/,
    /^\/live_project\/create(?:\/.*)?$/,
    /^\/u\/[^/]+\/create(?:\/.*)?$/,
    /^\/u\/[^/]+\/bookmarks(?:\/.*)?$/,
    /^\/project\/[^/]+\/edit(?:\/.*)?$/,
])

/**
 * Auth pages. A signed-in visitor has no business on them, so they are sent
 * to /sync (the one place that resolves where a signed-in user belongs)
 * instead of being shown a sign-in widget they would then be redirected away
 * from client-side.
 */
// Only the entry paths. Clerk owns the sub-paths (/sign-in/factor-one,
// /sign-up/sso-callback, /sign-up/continue) and a session can already exist
// part-way through them, so redirecting those would cut the handshake short.
const isAuthRoute = createRouteMatcher([/^\/sign-in$/, /^\/sign-up$/])

const clerk = clerkMiddleware(async (auth, request) => {
    const { userId } = await auth()

    if (isAuthRoute(request)) {
        if (userId) {
            return NextResponse.redirect(new URL('/sync', request.url))
        }

        return
    }

    if (isProtectedRoute(request)) {
        // Sends signed-out visitors to /sign-in with a return URL, and keeps
        // the API-shaped routes answering 401 instead of an HTML redirect.
        await auth.protect()
    }
})

export default function proxy(
    request: NextRequest,
    event: NextFetchEvent,
) {
    // Checked before Clerk runs, so maintenance mode still works even if the
    // Clerk keys are missing or the auth service is unreachable.
    const allowed = MAINTENANCE_ALLOWLIST.some(
        (path) =>
            request.nextUrl.pathname === path ||
            request.nextUrl.pathname.startsWith(`${path}/`),
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
