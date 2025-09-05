import React from "react";

export default function LoginPage() {
  return (
    <section className="container-page flex flex-col items-center">
      {/* Logo */}
      <img
        src="/assets/nutri.png"
        alt="Nutri Xpert Pro"
        className="w-auto object-contain mb-3 md:mb-6 h-20 sm:h-24 md:h-56"
      />

      <div className="w-full max-w-md text-left mx-auto rounded-2xl border p-6 shadow-[0_20px_60px_rgba(0,0,0,.20)] backdrop-blur dark:bg-white/5 dark:border-white/10 bg-white/90 border-black/10 mt-2">
        <p className="text-sm text-center mb-6 dark:text-[#A9B8D4] text-gray-700">
          Acesse sua conta para gerenciar clientes e dietas
        </p>

        <form className="space-y-4">
          <label className="block text-sm dark:text-[#A9B8D4] text-gray-800">
            Email
            <input
              type="email"
              placeholder="seu@email.com"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-white/50 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#21D4FD]"
            />
          </label>

          <label className="block text-sm dark:text-[#A9B8D4] text-gray-800">
            Senha
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-white/50 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#21D4FD]"
            />
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-xl border-2 px-6 py-3 text-base sm:text-lg font-semibold uppercase tracking-wide transition text-slate-800 bg-white border-cyan-400 hover:bg-slate-50 shadow-[0_4px_24px_rgba(0,199,255,.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:bg-transparent dark:border-[#21D4FD] dark:hover:bg-[rgba(33,212,253,.08)] dark:shadow-[0_0_24px_rgba(33,212,253,.35)] dark:focus-visible:ring-[#2AF598] dark:focus-visible:ring-offset-transparent"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}