import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("nxp-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("nxp-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Header com fundo SÓLIDO (sem blur/opacidade) */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <img
          src="/assets/logo.png"
          alt="Nutri Xpert Pro"
          className="h-16 sm:h-20 w-auto object-contain"
          decoding="async"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
            transform: "scale(1.3)",
          }}
          loading="eager"
          fetchPriority="high"
        />

        <button
          onClick={toggleTheme}
          aria-pressed={darkMode}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105
                     bg-white text-gray-800 border-gray-300 hover:bg-gray-50 shadow-sm
                     dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
          aria-label="Alternar tema"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              darkMode
                ? "bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                : "bg-gray-400"
            }`}
          />
          <span className="text-xs">Modo Dark</span>
        </button>
      </header>

      {/* Main ocupa o espaço livre; evita rolagem desnecessária */}
      <main className="relative flex-1">{children}</main>

      {/* Footer com fundo SÓLIDO */}
      <footer className="w-full px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
        <p>© 2025 Nutri Xpert Pro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}