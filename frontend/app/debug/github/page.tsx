// frontend/app/debug/github/page.tsx

import { currentUser } from "@clerk/nextjs/server"

export const dynamic = "force-dynamic"

export default async function GithubDebugPage() {
    const user = await currentUser()

    if (!user) {
        return <pre>Not signed in</pre>
    }

    const github = user.externalAccounts.find(
        (account) => account.provider === "github"
    )

    return (
        <pre>
            {JSON.stringify(
                {
                    clerkUserId: user.id,
                    githubUsername: github?.username ?? null,
                    githubUserId: github?.providerUserId ?? null,
                    githubUrl: github?.username
                        ? `https://github.com/${github.username}`
                        : null,
                    externalAccounts: user.externalAccounts.map((account) => ({
                        provider: account.provider,
                        username: account.username,
                        providerUserId: account.providerUserId,
                    })),
                },
                null,
                2
            )}
        </pre>
    )
}