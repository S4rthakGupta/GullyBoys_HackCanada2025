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

export default function NavBar() {
  return (
    <ClerkProvider>
      <nav className="w-full px-6 py-4 bg-white shadow-md flex justify-between items-center">
        {/* Logo / Branding */}
        <h1 className="text-xl font-semibold text-gray-900">MediQueue</h1>

        <div>
          <SignedOut>
            <SignInButton>
              <Button variant="default" className="mr-3">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton showName={true} />
          </SignedIn>
        </div>
      </nav>
      <Separator className="bg-gray-200" />
    </ClerkProvider>
  );
}
