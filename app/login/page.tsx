// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {/* Logo */}
        <div className="mb-8 animate-fadeIn">
          <img
            src="/assets/nutri.png"
            alt="Nutri Xpert Pro"
            className="w-auto h-16 sm:h-20 md:h-24 object-contain"
          />
        </div>

        {/* Card de Login — fundo sólido (sem película/blur) */}
        <div className="w-full max-w-sm sm:max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl bg-white dark:bg-neutral-900">
          <p className="text-center text-gray-600 dark:text-neutral-300 mb-6 sm:mb-8 text-base sm:text-lg">
            Acesse sua conta para gerenciar clientes e dietas
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                inputMode="email"
                autoCorrect="off"
                autoCapitalize="none"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Botão ENTRAR */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold text-lg rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"
                    role="status"
                    aria-label="Carregando"
                  />
                  Entrando...
                </div>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}