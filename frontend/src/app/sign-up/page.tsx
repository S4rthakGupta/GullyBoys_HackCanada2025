"use client";

import { useEffect } from "react";
import { useUser, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect the user to `/setup` after signing up
  useEffect(() => {
    if (isSignedIn) {
      router.push("/setup");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-blue-700">
      <SignUp routing="hash"/>
    </div>
  );
}
