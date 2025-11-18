import { LinearClient } from '@linear/sdk'

if (!process.env.LINEAR_API_KEY) {
    throw new Error('LINEAR_API_KEY is required')
}

export const linear = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
})

export async function createLinearIssue({
    title,
    description,
    teamId,
    organizationName,
}: {
    title: string
    description: string
    teamId: string
    organizationName: string
}) {
    const issue = await linear.createIssue({
        title: `[${organizationName}] ${title}`,
        description,
        teamId,
    })

    return issue
}
