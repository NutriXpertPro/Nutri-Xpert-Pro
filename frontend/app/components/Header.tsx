'use client'
import { useState, useEffect } from 'react'

export default function Header() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('nxp-theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
    localStorage.setItem('nxp-theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <header className="flex justify-between items-center p-4 sm:p-6">
      <img 
        src="/assets/nutri.png" 
        alt="Nutri Xpert Pro" 
        className="h-12 sm:h-16 w-auto object-contain"
      />
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-xl transition-all font-semibold text-sm"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  )
}
