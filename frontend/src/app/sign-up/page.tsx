"use client";

import { useEffect } from "react";
import { useUser, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const { isSignedIn, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn || !user) return; // Ensure user is signed in before running API call

        console.log("User signed up:", user);

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
            .then((res) => {
                if (!res.ok) throw new Error("Failed to save user");
                return res.json();
            })
            .then(() => {
                console.log("User saved to database successfully!");
                router.push("/setup"); // Redirect user after saving
            })
            .catch((error) => console.error("Error saving user:", error));
    }, [isSignedIn, user, router]); // Depend on `isSignedIn` & `user` to ensure it runs

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-blue-700">
            <SignUp routing="hash"/>
        </div>
    );
}
