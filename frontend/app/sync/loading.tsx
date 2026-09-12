import SyncStage from "./SyncStage"

/**
 * Shown while the server component below resolves the user's destination.
 * The animation is the whole point of the wait, so it belongs here rather
 * than in a client effect that could not start until after hydration.
 */
export default function Loading() {
    return <SyncStage />
}
