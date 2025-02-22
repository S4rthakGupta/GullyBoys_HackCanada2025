"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
    const router = useRouter();

    return (
        <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
            <h1 className="text-xl font-bold">MediQueue</h1>
            <Button variant="destructive" onClick={() => router.push("/admin/login")}>
                Logout
            </Button>
        </nav>
    );
}
