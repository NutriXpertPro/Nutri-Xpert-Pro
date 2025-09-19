"use client";
import React, { useState, useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nxp-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? (savedTheme === 'dark') : prefersDark;
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    document.documentElement.classList.toggle('dark', newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
    
    localStorage.setItem('nxp-theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div className="viewport-container">
      <header className="flex justify-between items-center shrink-0 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <img 
          src="/assets/nutri.png" 
          alt="Logo" 
          className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] object-contain"
        />
        <button
          onClick={toggleTheme}
          className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-cyan-500/90 hover:bg-cyan-600/90 dark:bg-cyan-600/90 dark:hover:bg-cyan-700/90 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base backdrop-blur-sm"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>
      <main className="content-area flex-1 relative z-10">
        <div className="h-full w-full p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
