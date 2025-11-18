import { redirect } from "next/navigation";

export default async function Home() {
    // Redirect to dashboard (or sign-in if not authenticated)
    redirect("/dashboard");
}
