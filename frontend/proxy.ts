import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (_auth, request) => {
    const maintenanceMode =
        process.env.MAINTENANCE_MODE === 'true'

    if (maintenanceMode) {
        const url = request.nextUrl.clone()

        url.pathname = '/maintenance.html'

        return NextResponse.rewrite(url)
    }
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/__clerk/(.*)',
    ],
}