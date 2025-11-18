import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Only admin and super-admin can access this
        await requireRole(["admin", "super-admin"]);

        const searchParams = request.nextUrl.searchParams;
        const orgId = searchParams.get("orgId");

        const where = orgId ? { organization: { clerkId: orgId } } : {};

        // Get all requests across organizations
        const requests = await prisma.request.findMany({
            where,
            include: {
                organization: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Error fetching admin requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}
