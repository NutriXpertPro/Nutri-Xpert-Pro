'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="relative flex min-h-screen items-center justify-center" style={{
      backgroundImage: 'url(/assets/background2.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="text-center space-y-8">
        <div className="absolute top-4 left-4">
          <img src="/assets/logo.png" alt="Nutri Xpert Pro" className="h-24 w-auto" />
        </div>

        {/* Título */}
        <div className="flex items-center justify-center w-max mx-auto">
          <img src="/assets/adipometro.png" alt="Adipometer" className="h-20 w-auto" style={{marginRight: '-50px', transform: 'translateY(25px)'}} />
          <img src="/assets/nutri.png" alt="Nutri Xpert Pro" className="h-64 w-auto" />
        </div>
        <p className="text-gray-300 text-lg md:text-xl">
          Sistema Profissional de Gestão Nutricional com Inteligência Artificial
        </p>

        {/* Botões */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="bg-white border border-gray-400 text-gray-800 px-8 py-3 rounded-full transition-all duration-300 hover:bg-transparent hover:text-white hover:border-white hover:shadow-none shadow-md"
            onClick={() => router.push('/login/nutritionist')}
          >
            Sou Nutricionista
          </button>
          <button
            className="border border-white text-white px-8 py-3 rounded-full transition-all duration-300 hover:bg-white hover:text-black"
            onClick={() => router.push('/login/patient')}
          >
            Sou Paciente
          </button>
        </div>

        {/* Rodapé */}
        <div className="text-sm text-gray-400 space-x-4 footer">
          <span>⚡ Sistema Ativo</span>
          <span>🤖 High Tech Nutrition</span>
          <span>🔒 Seguro & Privado</span>
        </div>
      </div>
    </main>
  )
}