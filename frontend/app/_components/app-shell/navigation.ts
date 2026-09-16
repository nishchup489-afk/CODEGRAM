import type { LucideIcon } from "lucide-react"
import {
    Activity,
    CalendarClock,
    FolderGit2,
    Github,
    Home,
    Settings,
    Terminal,
    User,
} from "lucide-react"

export type AppNavigationItem = {
    label: string
    href?: string
    icon: LucideIcon
    soon?: boolean
    match?: (pathname: string) => boolean
}

export type AppNavigationSection = {
    label?: string
    items: AppNavigationItem[]
}

export function getAppNavigation(username: string): AppNavigationSection[] {
    const userRoot = `/u/${username}`

    return [
        {
            items: [
                {
                    label: "Home",
                    href: userRoot,
                    icon: Home,
                    match: (pathname) => pathname === userRoot,
                },
                {
                    label: "Activity",
                    icon: Activity,
                    soon: true,
                },
                {
                    label: "Projects",
                    href: `${userRoot}/projects`,
                    icon: FolderGit2,
                    match: (pathname) => pathname.startsWith(`${userRoot}/projects`),
                },
                {
                    label: "Deadlines",
                    icon: CalendarClock,
                    soon: true,
                },
                {
                    label: "Profile",
                    href: `${userRoot}/me`,
                    icon: User,
                    match: (pathname) => pathname.startsWith(`${userRoot}/me`),
                },
            ],
        },
        {
            label: "Workspace",
            items: [
                {
                    label: "Settings",
                    href: "/settings",
                    icon: Settings,
                    match: (pathname) =>
                        pathname.startsWith("/settings") &&
                        !pathname.startsWith("/settings/github"),
                },
            ],
        },
        {
            label: "Integrations",
            items: [
                {
                    label: "GitHub",
                    href: "/settings/github",
                    icon: Github,
                    match: (pathname) => pathname.startsWith("/settings/github"),
                },
                {
                    label: "CLI",
                    icon: Terminal,
                    soon: true,
                },
            ],
        },
    ]
}
