"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
    return (
        <ClerkProvider>
            <nav className="w-full px-6 py-4 bg-white shadow-md flex justify-between items-center fixed top-0 left-0 z-50">
                {/* Logo / Branding */}
                <Link href="/">
                    <h1 className="text-xl font-semibold text-gray-900">
                        MediQueue
                    </h1>
                </Link>

                <div>
                    <Link href="/about">
                        <Button variant="ghost" className="mr-3">
                            About
                        </Button>
                    </Link>
                    <SignedOut>
                        {/* ✅ "Get Started" navigates to `/sign-up` */}
                        <Link href="/sign-up">
                            <Button variant="default" className="mr-3">
                                Get Started
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/setup" passHref>
                            <Button
                                size="lg"
                                className="mt-4 bg-blue-600 hover:bg-blue-500"
                            >
                                Get a Token
                            </Button>
                        </Link>
                        <UserButton showName={true} />
                    </SignedIn>
                </div>
            </nav>
        </ClerkProvider>
    );
}
