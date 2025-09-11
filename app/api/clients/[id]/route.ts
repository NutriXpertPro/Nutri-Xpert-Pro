import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { clients, users, updateClientSchema } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';
import { ZodError } from 'zod';

interface RouteParams {
  params: { id: string }
}

// GET /api/clients/[id] - Buscar cliente específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar o ID do usuário pela sessão
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email!))
      .limit(1);

    if (!userResult[0]) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar role
    if (userResult[0].role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    // Buscar cliente específico (verificando ownership)
    const clientResult = await db.select()
      .from(clients)
      .where(and(
        eq(clients.id, params.id),
        eq(clients.proId, userResult[0].id)
      ))
      .limit(1);

    const client = clientResult[0];

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ client });

  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Atualizar cliente
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar o ID do usuário pela sessão
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email!))
      .limit(1);

    if (!userResult[0]) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar role
    if (userResult[0].role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validar APENAS campos seguros para edição
    const validatedData = updateClientSchema.parse(body);

    // Atualizar cliente (verificando ownership)
    const [updatedClient] = await db.update(clients)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(and(
        eq(clients.id, params.id),
        eq(clients.proId, userResult[0].id)
      ))
      .returning();

    if (!updatedClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { client: updatedClient, message: 'Cliente atualizado com sucesso' }
    );

  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    
    // Tratamento correto de ZodError
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          issues: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Deletar cliente (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar o ID do usuário pela sessão
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email!))
      .limit(1);

    if (!userResult[0]) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar role
    if (userResult[0].role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    // Soft delete - marcar como inativo em vez de deletar
    const [deletedClient] = await db.update(clients)
      .set({ 
        active: false,
        updatedAt: new Date()
      })
      .where(and(
        eq(clients.id, params.id),
        eq(clients.proId, userResult[0].id)
      ))
      .returning();

    if (!deletedClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Cliente removido com sucesso' }
    );

  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}