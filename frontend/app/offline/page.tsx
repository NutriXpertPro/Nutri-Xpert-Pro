import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Ícone */}
        <div className="mb-8">
          <WifiOff className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Você está offline
        </h1>

        {/* Descrição */}
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
          Algumas funcionalidades podem estar disponíveis offline.
        </p>

        {/* Ações */}
        <div className="space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
            <Home className="w-4 h-4" />
            Ir para Início
          </Link>
        </div>

        {/* Funcionalidades offline */}
        <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Disponível Offline:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Calculadora TMB</li>
            <li>• Visualizar anamneses salvas</li>
            <li>• Dados em cache do dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}