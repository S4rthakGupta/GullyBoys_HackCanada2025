"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";

export default function TokenPage() {
  // Hardcoded token values
  const yourToken = 25;
  const currentToken = 25;

  // Boolean flag: If your token is called, UI changes (Green BG)
  const isCalled = yourToken === currentToken;

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col items-center justify-center transition-all duration-500",
        isCalled ? "bg-green-500" : "bg-gradient-to-br from-blue-50 to-blue-100"
      )}
    >
      

      {/* Currently Serving */}
      <p className="text-lg font-semibold text-gray-700">
        Now Serving:{" "}
        <span className="text-5xl font-extrabold text-red-600 animate-pulse">
          {currentToken}
        </span>
      </p>

      {/* Your Token */}
      <Card className="w-72 text-center shadow-lg border border-gray-300 bg-white rounded-lg p-6 mt-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-600">{isCalled ? "It's your turn" : "Your Token"}</h2>
          <p className="text-6xl font-bold text-blue-700 mt-2">{yourToken}</p>
        </CardContent>
      </Card>


      {/* Footer */}
      <footer className="fixed bottom-0 text-center text-gray-500 text-sm pb-10">
        © {new Date().getFullYear()} MediQueue. All rights reserved.
      </footer>
    </div>
  );
}
