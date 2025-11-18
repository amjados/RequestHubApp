// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RequestForm from "@/components/request-form";
import RequestList from "@/components/request-list";
// import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export default async function DashboardPage() {
    // Temporarily disabled for testing - uncomment when Clerk is configured
    // const { userId, orgId } = await auth();
    // if (!userId) {
    //     redirect("/sign-in");
    // }

    // Demo mode: Use a test organization
    const TEST_ORG_CLERK_ID = "test_org_demo";

    // Get or create test organization
    let organization = await prisma.organization.findUnique({
        where: { clerkId: TEST_ORG_CLERK_ID },
    });

    if (!organization) {
        organization = await prisma.organization.create({
            data: {
                clerkId: TEST_ORG_CLERK_ID,
                name: "Demo Organization",
            },
        });
    }

    // Fetch requests for this organization
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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Request Hub</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                            Demo Mode
                        </span>
                        {/* <OrganizationSwitcher /> */}
                        {/* <UserButton /> */}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Demo Mode:</strong> Authentication is disabled. Configure Clerk in .env to enable full features.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <RequestForm />
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
                        <RequestList initialRequests={JSON.parse(JSON.stringify(requests))} />
                    </div>
                </div>
            </main>
        </div>
    );
}
