"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    const { isSignedIn, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn && user) {
            // Send user data to backend with correct parameters
            fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                    phone: "", // Clerk does not provide a phone field
                    email: user.primaryEmailAddress?.emailAddress || "",
                }),
            })
                .then((res) => res.json())
                .then(() => {
                    router.push("/dashboard"); // Redirect user after saving
                })
                .catch((error) => console.error("Error saving user:", error));
        }
    }, [isSignedIn, user, router]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
            <SignIn />
        </div>
    );
}
