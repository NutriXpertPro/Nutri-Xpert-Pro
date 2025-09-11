"use client";

import { SessionProvider } from "next-auth/react"
import CustomThemeProvider from "@/app/components/ThemeProvider"

export default function Providers({ 
  children, 
  session 
}: {
  children: React.ReactNode
  session?: any
}) {
  return (
    <SessionProvider session={session}>
      <CustomThemeProvider>
        {children}
      </CustomThemeProvider>
    </SessionProvider>
  )
}