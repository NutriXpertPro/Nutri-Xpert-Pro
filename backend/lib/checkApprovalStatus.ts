import { prisma } from './prisma';

export async function checkNutritionistApprovalStatus(userId: string): Promise<{
  isApproved: boolean;
  status: string | null;
  message?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      subscriptionStatus: true,
      isPro: true,
    },
  });

  if (!user) {
    return {
      isApproved: false,
      status: null,
      message: 'Usuário não encontrado.',
    };
  }

  if (user.role !== 'NUTRITIONIST') {
    return {
      isApproved: true,
      status: 'NOT_NUTRITIONIST',
    };
  }

  if (!user.subscriptionStatus || user.subscriptionStatus === 'PENDING') {
    return {
      isApproved: false,
      status: 'PENDING',
      message: 'Seu cadastro está aguardando aprovação. Você receberá uma notificação assim que for aprovado.',
    };
  }

  if (user.subscriptionStatus === 'REJECTED') {
    return {
      isApproved: false,
      status: 'REJECTED',
      message: 'Seu cadastro foi rejeitado. Entre em contato com o suporte para mais informações.',
    };
  }

  if (user.subscriptionStatus === 'CANCELLED') {
    return {
      isApproved: false,
      status: 'CANCELLED',
      message: 'Sua assinatura foi cancelada. Renove para continuar usando a plataforma.',
    };
  }

  if (user.subscriptionStatus === 'ACTIVE' && user.isPro) {
    return {
      isApproved: true,
      status: 'ACTIVE',
    };
  }

  return {
    isApproved: false,
    status: user.subscriptionStatus,
    message: 'Status de aprovação desconhecido. Entre em contato com o suporte.',
  };
}
