import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { clients, users, createClientSchema } from '@/shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import { ZodError } from 'zod';

// GET /api/clients - Listar clientes ATIVOS do usuário autenticado com paginação
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar ou criar usuário automaticamente (OAuth)
    let userResult = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult[0]) {
      // Criar usuário automaticamente para OAuth
      const [newUser] = await db.insert(users).values({
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
        role: 'client', // Default seguro - precisa ser promovido para nutritionist
        emailVerified: new Date()
      }).returning();
      userResult = [newUser];
    }

    // Verificar role
    if (userResult[0].role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    // Paginação
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // Buscar clientes ATIVOS do usuário com paginação
    const userClients = await db.select()
      .from(clients)
      .where(and(
        eq(clients.proId, userResult[0].id),
        eq(clients.active, true) // Apenas ativos
      ))
      .orderBy(desc(clients.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ 
      clients: userClients,
      pagination: { page, limit, total: userClients.length }
    });

  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar ou criar usuário automaticamente (OAuth)
    let userResult = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult[0]) {
      // Criar usuário automaticamente para OAuth
      const [newUser] = await db.insert(users).values({
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
        role: 'client', // Default seguro
        emailVerified: new Date()
      }).returning();
      userResult = [newUser];
    }

    // Verificar role
    if (userResult[0].role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validar APENAS campos seguros com schema específico
    const validatedData = createClientSchema.parse(body);

    // Inserir no banco com campos controlados pelo servidor
    const [newClient] = await db.insert(clients)
      .values({
        ...validatedData,
        proId: userResult[0].id, // Definido pelo servidor
        active: true,            // Sempre ativo na criação
        // timestamps são automáticos
      })
      .returning();

    return NextResponse.json(
      { client: newClient, message: 'Cliente criado com sucesso' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    
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