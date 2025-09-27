import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }
  return NextResponse.json({
    sessionUser: session.user,
    dbUser: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
}
