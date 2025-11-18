import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerRequestUpdate } from "@/lib/pusher";

export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const signature = request.headers.get("x-linear-signature");
        const webhookSecret = process.env.WEBHOOK_SECRET;

        if (webhookSecret && signature !== webhookSecret) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const body = await request.json();
        const { action, data, type } = body;

        // Handle issue status updates
        if (type === "Issue" && (action === "update" || action === "create")) {
            const issueId = data.id;
            const status = data.state?.name || data.stateId;

            // Find the request with this Linear issue ID
            const existingRequest = await prisma.request.findFirst({
                where: { linearIssueId: issueId },
            });

            if (existingRequest) {
                // Map Linear status to our status
                let newStatus = existingRequest.status;
                if (status?.toLowerCase().includes("done") || status?.toLowerCase().includes("completed")) {
                    newStatus = "COMPLETED";
                } else if (status?.toLowerCase().includes("progress") || status?.toLowerCase().includes("started")) {
                    newStatus = "IN_PROGRESS";
                } else if (status?.toLowerCase().includes("cancel")) {
                    newStatus = "CANCELLED";
                }

                // Update request status
                const updatedRequest = await prisma.request.update({
                    where: { id: existingRequest.id },
                    data: { status: newStatus },
                });

                // Trigger real-time update via Pusher
                await triggerRequestUpdate(updatedRequest.id, newStatus);

                return NextResponse.json({
                    success: true,
                    message: "Request updated",
                });
            }
        }

        return NextResponse.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
