import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { requireOrg } from "@/lib/auth";
import { createLinearIssue } from "@/lib/linear";
import { z } from "zod";

const requestSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
});

export async function POST(request: NextRequest) {
    try {
        // Demo mode: Use test organization
        // const user = await requireOrg();
        const TEST_ORG_CLERK_ID = "test_org_demo";
        const TEST_USER_ID = "test_user_demo";

        const body = await request.json();

        // Validate input
        const validatedData = requestSchema.parse(body);

        // Get or create organization in database
        let organization = await prisma.organization.findUnique({
            where: { clerkId: TEST_ORG_CLERK_ID },
        });

        if (!organization) {
            // Create organization if it doesn't exist
            organization = await prisma.organization.create({
                data: {
                    clerkId: TEST_ORG_CLERK_ID,
                    name: "Demo Organization",
                },
            });
        }

        // Create Linear issue (will fail gracefully if Linear API key not configured)
        let linearIssueId: string | undefined;
        let linearIssueUrl: string | undefined;

        try {
            const linearIssue = await createLinearIssue({
                title: validatedData.title,
                description: validatedData.description,
                teamId: process.env.LINEAR_TEAM_ID!,
                organizationName: organization.name,
            });

            const issue = await linearIssue.issue;
            linearIssueId = issue?.id;
            linearIssueUrl = issue?.url;
        } catch {
            console.log("Linear integration not configured, skipping issue creation");
        }

        // Create request in database
        const newRequest = await prisma.request.create({
            data: {
                title: validatedData.title,
                category: validatedData.category,
                description: validatedData.description,
                organizationId: organization.id,
                createdBy: TEST_USER_ID,
                linearIssueId,
                linearIssueUrl,
                status: "PENDING",
            },
            include: {
                organization: true,
            },
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating request:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create request" },
            { status: 500 }
        );
    }
}

export async function GET(_request: NextRequest) {
    try {
        // Demo mode: Use test organization
        // const user = await requireOrg();
        const TEST_ORG_CLERK_ID = "test_org_demo";

        // Get organization
        const organization = await prisma.organization.findUnique({
            where: { clerkId: TEST_ORG_CLERK_ID },
        });

        if (!organization) {
            return NextResponse.json({ requests: [] });
        }

        // Get all requests for this organization
        const requests = await prisma.request.findMany({
            where: {
                organizationId: organization.id,
            },
            include: {
                organization: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}
