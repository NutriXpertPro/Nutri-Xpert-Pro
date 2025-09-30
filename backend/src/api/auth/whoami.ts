import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthSession } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';

export default async function whoami(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession();
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  return res.status(200).json({
    sessionUser: session.user,
    dbUser: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
}
