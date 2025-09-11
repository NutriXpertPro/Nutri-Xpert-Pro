// app/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleAccessClick = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        
        {/* Logo NUTRI XPERT PRO - Mais próxima do título */}
        <div className="mb-6">
          <img
            src="/assets/nutri.png"
            alt="Nutri Xpert Pro"
            className="w-72 h-auto object-contain drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
            onError={(e) => {
              console.error("Erro ao carregar nutri.png");
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          {/* Fallback text melhorado */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hidden text-center">
            NUTRI XPERT PRO
          </h1>
        </div>

        {/* Título - Cor mais escura e legível */}
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 text-center uppercase tracking-wider font-semibold">
          Sistema Profissional de Gestão Nutricional
        </p>

        {/* Card - Cor mais suave (cinza bem claro) */}
        <div className="w-full max-w-sm bg-gray-100/90 dark:bg-gray-800/85 backdrop-blur-md rounded-2xl p-7 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          
          {/* Botão menor */}
          <button
            onClick={handleAccessClick}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-gray-900 font-bold text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-cyan-500/25 hover:scale-105 mb-4"
          >
            Login
          </button>

          {/* Texto menor para caber em uma linha */}
          <p className="text-center text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
            Gerencie clientes e dietas
          </p>
        </div>

        {/* Badge de status */}
        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Sistema ativo e seguro</span>
        </div>

      </div>
    </div>
  );
}