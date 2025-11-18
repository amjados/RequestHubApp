// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
// import { UserButton } from "@clerk/nextjs";
import AdminRequestList from "@/components/admin-request-list";

export default async function AdminPage() {
    // Temporarily disabled for testing - uncomment when Clerk is configured
    // const { userId, sessionClaims } = await auth();
    // if (!userId) {
    //     redirect("/sign-in");
    // }
    // const role = (sessionClaims?.metadata as any)?.role;
    // if (role !== "admin" && role !== "super-admin") {
    //     redirect("/dashboard");
    // }

    // Fetch all requests across all organizations
    const requests = await prisma.request.findMany({
        include: {
            organization: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const organizations = await prisma.organization.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                        Demo Mode
                    </span>
                    {/* <UserButton /> */}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Demo Mode:</strong> Role-based access control is disabled. Configure Clerk to enable admin authentication.
                    </p>
                </div>

                <AdminRequestList
                    initialRequests={JSON.parse(JSON.stringify(requests))}
                    organizations={JSON.parse(JSON.stringify(organizations))}
                />
            </main>
        </div>
    );
}
