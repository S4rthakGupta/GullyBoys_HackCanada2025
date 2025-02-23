"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";

export default function TokenPage() {
    const { user } = useUser();
    const userId = user?.id || "";

    const [yourToken, setYourToken] = useState(null);
    const [currentToken, setCurrentToken] = useState(null);

    // Fetch user's personal token once
    useEffect(() => {
        const fetchMyToken = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:8000/api/token/my-token/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch your token");

                const data = await response.json();
                setYourToken(data.token || null);
            } catch (error) {
                console.error("Error fetching personal token:", error);
            }
        };

        if (userId) fetchMyToken(); // Fetch only if userId is available
    }, [userId]);

    // Fetch current serving token every 7 seconds (polling)
    useEffect(() => {
        const fetchCurrentToken = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/token/current");
                if (!response.ok) throw new Error("Failed to fetch current token");

                const data = await response.json();
                setCurrentToken(data.currentToken || 0);
            } catch (error) {
                console.error("Error fetching current token:", error);
            }
        };

        fetchCurrentToken(); // Fetch immediately on load

        const interval = setInterval(fetchCurrentToken, 7000); // Poll every 7 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Boolean flag: If your token is called, UI changes (Green BG)
    const isCalled = yourToken !== null && currentToken !== null && yourToken === currentToken;

    return (
        <div
            className={clsx(
                "min-h-screen flex flex-col items-center justify-center transition-all duration-500",
                isCalled ? "bg-green-500" : "bg-gradient-to-br from-blue-50 to-blue-100"
            )}
        >
            {/* Currently Serving */}
            <p className="text-lg font-semibold text-gray-700">
                {currentToken === 0 ? (
                    <span className="text-3xl font-extrabold text-gray-600">Wait for clinic to open</span>
                ) : (
                    <>
                        Now Serving:{" "}
                        <span className="text-5xl font-extrabold text-red-600 animate-pulse">
                            {currentToken !== null ? currentToken : "--"}
                        </span>
                    </>
                )}
            </p>

            {/* Your Token */}
            <Card className="w-72 text-center shadow-lg border border-gray-300 bg-white rounded-lg p-6 mt-6">
                <CardContent>
                    <h2 className="text-lg font-semibold text-gray-600">
                        {isCalled ? "It's your turn!" : "Your Token"}
                    </h2>
                    <p className="text-6xl font-bold text-blue-700 mt-2">
                        {yourToken !== null ? yourToken : "--"}
                    </p>
                </CardContent>
            </Card>

            {/* Footer */}
            <footer className="fixed bottom-0 text-center text-gray-500 text-sm pb-10">
                © {new Date().getFullYear()} MediQueue. All rights reserved.
            </footer>
        </div>
    );
}
