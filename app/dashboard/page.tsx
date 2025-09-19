'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-4">Painel de Controle</h1>
      <p className="text-center">
        Gerencie seus clientes.{' '}
        <Link href="/anamnesis" className="text-blue-600 hover:underline">
          Nova Anamnese
        </Link>
      </p>
    </main>
  );
}