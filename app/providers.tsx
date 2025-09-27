"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./hooks/useTheme"; // Import the new ThemeProvider (context provider)

export default function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider> {/* Wrap children with the new ThemeProvider */}
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
