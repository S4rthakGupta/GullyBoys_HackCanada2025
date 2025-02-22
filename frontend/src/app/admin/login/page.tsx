"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setError(""); // Clear previous errors

        try {
            // const response = await fetch("/admin/auth", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email, password }),
            // });

            // if (!response.ok) throw new Error("Invalid credentials");

            router.push("/admin/queue"); // Navigate to queue page on success
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96 p-6">
                <CardHeader>
                    <h2 className="text-center text-2xl font-semibold">Admin Login</h2>
                </CardHeader>
                <CardContent>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                    />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <Button className="w-full" onClick={handleLogin}>
                        Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
