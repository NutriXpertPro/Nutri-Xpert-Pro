// app/components/ThemeProvider.tsx (will be renamed conceptually to ThemeToggle.tsx)
"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "../hooks/useTheme"; // Import the useTheme hook
import { Button } from "../../components/ui/button"; // Corrected path for Button

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center shrink-0 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
      <Image
        src="/assets/nutri.png"
        alt="Logo"
        width={120} // Add width and height for Next/Image
        height={120}
        className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] object-contain"
      />
      <Button
        onClick={toggleTheme}
        className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-cyan-500/90 hover:bg-cyan-600/90 dark:bg-cyan-600/90 dark:hover:bg-cyan-700/90 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base backdrop-blur-sm"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </Button>
    </header>
  );
}