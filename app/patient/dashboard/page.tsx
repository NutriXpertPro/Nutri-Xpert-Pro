'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login/patient');
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">Dashboard do Paciente</h1>
        <p className="text-lg text-gray-700">Bem-vindo(a), <span className="font-semibold">{session?.user?.name || 'Paciente'}</span>!</p>
        <p className="text-md text-gray-600">Seu email de login é: {session?.user?.email}</p>
        <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
          <p className="font-bold">Em breve:</p>
          <p>Aqui você visualizará sua dieta, evolução e avaliações.</p>
        </div>
      </div>
    </div>
  );
}
