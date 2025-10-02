'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/src/components/ui/card';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiresApproval?: boolean;
}

export default function SubscriptionGuard({ 
  children, 
  requiresApproval = true 
}: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const user = session.user as any;

  if (user.role === 'NUTRITIONIST' && requiresApproval) {
    const subscriptionStatus = user.subscriptionStatus;

    if (subscriptionStatus === 'PENDING') {
      return (
        <div className="container mx-auto py-10">
          <Card className="p-8 max-w-2xl mx-auto text-center">
            <div className="text-yellow-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Aguardando Aprovação</h2>
            <p className="text-gray-600 mb-6">
              Seu pagamento foi confirmado com sucesso! Agora seu cadastro está em análise. 
              Você receberá uma notificação assim que for aprovado.
            </p>
            <p className="text-sm text-gray-500">
              Este processo geralmente leva até 24 horas.
            </p>
          </Card>
        </div>
      );
    }

    if (subscriptionStatus === 'REJECTED') {
      return (
        <div className="container mx-auto py-10">
          <Card className="p-8 max-w-2xl mx-auto text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Cadastro Não Aprovado</h2>
            <p className="text-gray-600 mb-6">
              Infelizmente seu cadastro não foi aprovado. 
              Por favor, entre em contato com o suporte para mais informações.
            </p>
            <button 
              onClick={() => router.push('/suporte')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Contatar Suporte
            </button>
          </Card>
        </div>
      );
    }

    if (subscriptionStatus === 'CANCELLED' || !user.isPro) {
      return (
        <div className="container mx-auto py-10">
          <Card className="p-8 max-w-2xl mx-auto text-center">
            <div className="text-orange-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Assinatura Inativa</h2>
            <p className="text-gray-600 mb-6">
              Sua assinatura está inativa. Renove para continuar usando a plataforma.
            </p>
            <button 
              onClick={() => router.push('/assinatura')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Renovar Assinatura
            </button>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
}
