"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6  bg-white text-black">
            {/* Hero Section */}
            <section className="max-w-4xl text-center space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">
                    Streamlining Clinic Check-ins
                </h1>
                <p className="text-lg text-gray-400">
                    Effortlessly check in at clinics, skip the lines, and get
                    updates in real-time.
                </p>
                

                <SignedOut>
                    <SignInButton>
                        <Button variant="default" className="mr-3">
                            Get Started
                        </Button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link href="/signin" passHref>
                      <Button
                          size="lg"
                          className="mt-4 bg-blue-600 hover:bg-blue-500"
                      >
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
                            Scan a QR code and register instantly without
                            waiting in line.
                        </p>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-gray-50 border-gray-200">
                    <CardContent className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Real-time Updates
                        </h2>
                        <p className="text-gray-400">
                            Get notified about your position in the queue and
                            estimated wait time.
                        </p>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-gray-50 border-gray-200">
                    <CardContent className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Secure & Private
                        </h2>
                        <p className="text-gray-400">
                            Your data is protected with end-to-end encryption
                            and privacy-first policies.
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
