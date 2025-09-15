
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface RouteParams {
  params: { id: string }
}

const updateClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z.number().min(1).max(120).optional(),
  sex: z.enum(["Masculino", "Feminino"]).optional(),
  profession: z.string().optional(),
  notes: z.string().optional(),
  evaluationType: z.enum(["virtual", "presencial"]).optional(),
});

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

    // Buscar cliente com dados relacionados
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        nutritionistId: user.id,
        active: true
      },
      include: {
        anamnesis: {
          include: {
            photos: true
          }
        },
        evaluations: {
          include: {
            photos: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        diets: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            evaluations: {
              where: { status: 'pending' }
            }
          }
        }
      }
    });

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
    const validatedData = updateClientSchema.parse(body);

    // Verificar se cliente existe e pertence ao usuário
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        nutritionistId: user.id
      }
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Verificar email único (se alterado)
    if (validatedData.email && validatedData.email !== existingClient.email) {
      const emailExists = await prisma.client.findFirst({
        where: {
          email: validatedData.email,
          nutritionistId: user.id,
          active: true,
          id: { not: params.id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Já existe um cliente com este email' },
          { status: 400 }
        );
      }
    }

    // Atualizar cliente
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json(
      { client: updatedClient, message: 'Cliente atualizado com sucesso' }
    );

  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    
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

    // Soft delete - marcar como inativo
    const deletedClient = await prisma.client.updateMany({
      where: {
        id: params.id,
        nutritionistId: user.id
      },
      data: { 
        active: false
      }
    });

    if (deletedClient.count === 0) {
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
