import { auth } from "@clerk/nextjs/server";

export type UserRole = "user" | "admin" | "super-admin";

export async function getCurrentUser() {
    const { userId, orgId, sessionClaims } = await auth();

    if (!userId) {
        return null;
    }

    // Extract role from Clerk metadata
    const role = (sessionClaims?.metadata as { role?: UserRole })?.role || "user";

    return {
        userId,
        orgId: orgId || null,
        role,
    };
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function requireOrg() {
    const user = await requireAuth();
    if (!user.orgId) {
        throw new Error("No organization selected");
    }
    return user;
}

export async function requireRole(requiredRole: UserRole | UserRole[]) {
    const user = await requireAuth();
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!roles.includes(user.role)) {
        throw new Error("Insufficient permissions");
    }

    return user;
}
