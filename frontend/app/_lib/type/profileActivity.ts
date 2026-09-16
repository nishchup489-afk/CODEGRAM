// =========================================================
// PROFILE ACTIVITY
// Shapes the profile overview expects from the activity API.
// Until the endpoint exists the page passes empty values and
// every section renders its empty state.
// =========================================================

/** Mirrors the backend ActivityClass enum exactly. */
export type ActivityCategory = "build" | "learn" | "ship" | "collaborate" | "contribute"

export type ActivitySource = "github" | "leetcode" | "manual" | "devto" | "hashnode" | "gitlab" | "import" | "system"

/** One calendar day. `counts` holds how many entries of each category happened that day. */
export type ActivityDay = {
    date: string // YYYY-MM-DD
    counts: Partial<Record<ActivityCategory, number>>
}

export type ProfileRecentActivity = {
    id: string
    title: string
    context: string | null // project name, "LeetCode", …
    category: ActivityCategory
    source: ActivitySource
    occurred_at: string
}

export type ProfileActivity = {
    days: ActivityDay[]
    recent: ProfileRecentActivity[]
    github_imported_days: number | null
}

/** Profile fields the design uses that the user model doesn't have yet. */
export type ProfileExtras = {
    headline: string | null
    quote: string | null
    learning: string[]
    twitter_url: string | null
    open_to_opportunities: boolean
    opportunities_note: string | null
}

export const EMPTY_PROFILE_ACTIVITY: ProfileActivity = {
    days: [],
    recent: [],
    github_imported_days: null,
}

export const EMPTY_PROFILE_EXTRAS: ProfileExtras = {
    headline: null,
    quote: null,
    learning: [],
    twitter_url: null,
    open_to_opportunities: false,
    opportunities_note: null,
}
