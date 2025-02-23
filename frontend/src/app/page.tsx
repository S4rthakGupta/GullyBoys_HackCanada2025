"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import NavBar from "@/components/nav";

export default function Home() {
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        if (!isSignedIn || !user) return; // Ensure user is logged in before running API call

        console.log("User detected on Home Page:", user.id);

        // Send user data to backend
        fetch("http://localhost:8000/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                phone: "", // Clerk does not provide a phone field
                email: user.primaryEmailAddress?.emailAddress || "",
                userId: user.id,
            }),
        })
            .then((res) => {
                if (!res.ok) console.log("Failed to save user");
                return res.json();
            })
            .then(() => console.log("User saved to database successfully!"))
            .catch((error) => console.error("Error saving user:", error));
    }, [isSignedIn, user]); // Run this effect when user state updates

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-white text-black">
            <NavBar />
            
            {/* Hero Section */}
            <section className="max-w-4xl text-center space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">
                    Streamlining Clinic Check-ins
                </h1>
                <p className="text-lg text-gray-400">
                    Effortlessly check in at clinics, skip the lines, and get updates in real-time.
                </p>

                <SignedOut>
                    <Link href="/sign-up">
                        <Button variant="default" className="mr-3">
                            Get Started
                        </Button>
                    </Link>
                </SignedOut>

                <SignedIn>
                    <Link href="/setup" passHref>
                        <Button size="lg" className="mt-4 bg-blue-600 hover:bg-blue-500">
                            Get a Token
                        </Button>
                    </Link>
                </SignedIn>
            </section>

            <Separator className="w-full my-10 bg-gray-200" />

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-6 max-w-5xl">
                <Card className="p-6 bg-gray-50 border-gray-200">
                    <CardContent className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Instant Check-in
                        </h2>
                        <p className="text-gray-400">
                            Scan a QR code and register instantly without waiting in line.
                        </p>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-gray-50 border-gray-200">
                    <CardContent className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Real-time Updates
                        </h2>
                        <p className="text-gray-400">
                            Get notified about your position in the queue and estimated wait time.
                        </p>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-gray-50 border-gray-200">
                    <CardContent className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Secure & Private
                        </h2>
                        <p className="text-gray-400">
                            Your data is protected with end-to-end encryption and privacy-first policies.
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Separator className="w-full my-10 bg-gray-200" />

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MediQueue. All rights reserved.
            </footer>
        </main>
    );
}
