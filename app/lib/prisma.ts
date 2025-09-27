import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const getClientById = async (clientId: string) => {
  return prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      evaluations: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      diet: true,
    },
  });
};