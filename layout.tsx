import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    localStorage.setItem("nxp-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full relative grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: darkMode
            ? "radial-gradient(120% 120% at 50% 0%, rgba(8,12,18,0.35) 0%, rgba(8,12,18,0.55) 70%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(248,250,255,0.92) 100%)",
        }}
      />

      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between backdrop-blur border-b dark:bg-[#0F1621]/70 dark:border-white/10 bg-white/70 border-black/5">
        <img src="/assets/Logo.png" alt="Nutri Xpert Pro" className="h-[64px] sm:h-[72px] w-auto" />

        <button
          onClick={() => setDarkMode(v => !v)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition
                     dark:bg-[#0F1621] dark:text-white dark:border-white/30 dark:hover:bg-[#152134]
                     bg-white text-gray-800 border-black/20 hover:bg-gray-100"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${darkMode ? "bg-[#2AF598] shadow-[0_0_10px_rgba(42,245,152,.9)]" : "bg-gray-400"}`} />
          <span suppressHydrationWarning>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </header>

      <main className="relative z-0 px-4 sm:px-6 py-8">{children}</main>

      <footer className="w-full px-4 py-3 text-center text-xs dark:text-[#A9B8D4] dark:bg-[#0F1621]/70 text-gray-600 bg-white/70 backdrop-blur">
        © 2025 Nutri Xpert Pro. Todos os direitos reservados.
      </footer>
    </div>
  );
}