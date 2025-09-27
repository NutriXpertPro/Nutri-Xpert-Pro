'use client'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo maior */}
        <div className="text-center mb-8">
          <img src="/assets/nutri.png" alt="NutriXpert Pro" className="w-48 h-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Como você quer acessar?</h1>
        </div>

        {/* Box com transparência para ver background */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
                        <Link href="/login/nutritionist">
              <div className="group cursor-pointer bg-white/60 dark:bg-gray-700/60 p-6 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition-colors">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Nutricionista</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gerencie seus pacientes</p>
                </div>
              </div>
            </Link>

                        <Link href="/login/patient">
              <div className="group cursor-pointer bg-white/60 dark:bg-gray-700/60 p-6 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500 transition-colors">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Paciente</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Acompanhe sua evolução</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
