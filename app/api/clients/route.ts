
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z.number().min(1).max(120).optional(),
  sex: z.enum(["Masculino", "Feminino"]).optional(),
  profession: z.string().optional(),
  notes: z.string().optional(),
  evaluationType: z.enum(["virtual", "presencial"]).default("virtual"),
  birthDate: z.date().optional(),
});

// GET /api/clients - Listar clientes do nutricionista
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar role
    if (user.role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    // Paginação
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    // Buscar clientes ativos
    const clients = await prisma.client.findMany({
      where: {
        nutritionistId: user.id,
        active: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
      include: {
        _count: {
          select: {
            evaluations: {
              where: { status: 'pending' }
            }
          }
        }
      }
    });

    // Calcular próximas avaliações
    const clientsWithStatus = clients.map(client => {
      const pendingEvaluations = client._count.evaluations;
      
      return {
        ...client,
        hasPendingEvaluations: pendingEvaluations > 0,
        pendingEvaluationsCount: pendingEvaluations
      };
    });

    return NextResponse.json({ 
      clients: clientsWithStatus,
      pagination: { page, limit, total: clients.length }
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

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar role
    if (user.role !== 'nutritionist') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas nutricionistas podem gerenciar clientes.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validar dados
    const validatedData = createClientSchema.parse(body);

    // Verificar se email já existe (se fornecido)
    if (validatedData.email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          email: validatedData.email,
          nutritionistId: user.id,
          active: true
        }
      });

      if (existingClient) {
        return NextResponse.json(
          { error: 'Já existe um cliente com este email' },
          { status: 400 }
        );
      }
    }

    // Criar cliente
    const newClient = await prisma.client.create({
      data: {
        ...validatedData,
        nutritionistId: user.id,
        // Calcular próxima avaliação (15 dias)
        nextEvaluationDate: validatedData.evaluationType === 'virtual' 
          ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          : null
      }
    });

    return NextResponse.json(
      { client: newClient, message: 'Cliente criado com sucesso' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    
    if (error instanceof z.ZodError) {
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
