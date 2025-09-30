import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/backend/lib/auth';
import * as z from 'zod';
import { calculateBodyFatPercentageNavy } from '@/backend/lib/calculations';

// Esquema de validação com Zod (replicando o do frontend)
const anamnesisSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  wakeTime: z.string().optional(),
  sleepTime: z.string().optional(),
  weight: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0.1, 'Peso deve ser um número positivo.')
  ),
  height: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0.1, 'Altura deve ser um número positivo.')
  ),
  goal: z.enum(['Emagrecimento', 'Ganho de massa muscular', 'Ganho de peso', 'Trincar o shape e ganhar massa muscular'], { errorMap: () => ({ message: 'Selecione um objetivo válido.' }) }),
  doenca_familiar: z.string().optional(),
  foto_frente: z.any().optional(), // Adicionado para evitar erro de propriedade
  sexo: z.enum(['Masculino', 'Feminino', 'Outro'], { errorMap: () => ({ message: 'Selecione o sexo.' }) }).optional(),
  ja_fez_dieta: z.boolean().optional(),
  dieta_resultado: z.string().optional(),
  problema_saude: z.boolean().optional(),
  problema_saude_descricao: z.string().optional(),
  medicamentos: z.boolean().optional(),
  medicamentos_descricao: z.string().optional(),
  intolerancia: z.boolean().optional(),
  intolerancia_descricao: z.string().optional(),
  alcool: z.boolean().optional(),
  alcool_frequencia: z.string().optional(),
  anabolizante: z.boolean().optional(),
  anabolizante_problemas: z.string().optional(),
  quadril: z.preprocess((val) => parseFloat(String(val)), z.number().min(0.1, 'Quadril deve ser um número positivo.')).optional(),
  neck: z.preprocess((val) => parseFloat(String(val)), z.number().min(0.1, 'Pescoço deve ser um número positivo.')).optional(),
  waist: z.preprocess((val) => parseFloat(String(val)), z.number().min(0.1, 'Cintura deve ser um número positivo.')).optional(),
  anticoncepcional: z.boolean().optional(),
});

interface RouteParams {
  params: { clientId: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const { clientId } = params;

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.nutritionistId !== session.user.id) {
      return NextResponse.json({ message: 'Cliente não encontrado ou não autorizado' }, { status: 404 });
    }

    const body = await request.json();
    const validatedAnamnesisData = anamnesisSchema.parse(body);

    // Handle foto_frente separately if it's a file upload, for now, assume it's a URL string if present
    // For actual file upload, you'd need a different approach (e.g., FormData, separate upload API)
    const { foto_frente, ...dataWithoutFotoFrente } = validatedAnamnesisData;

    // Fetch client to get sex for body fat calculation
    const clientWithSex = await prisma.client.findUnique({
      where: { id: clientId },
      select: { sex: true },
    });

    let bodyFatPercentage: number | undefined;
    if (clientWithSex?.sex && dataWithoutFotoFrente.height && dataWithoutFotoFrente.neck && dataWithoutFotoFrente.waist) {
      bodyFatPercentage = calculateBodyFatPercentageNavy(
        clientWithSex.sex as 'Masculino' | 'Feminino',
        dataWithoutFotoFrente.height,
        dataWithoutFotoFrente.neck,
        dataWithoutFotoFrente.waist,
        dataWithoutFotoFrente.quadril || undefined // quadril is hip, optional for men
      );
    }

    const anamnesis = await prisma.anamnesis.upsert({
      where: { clientId: clientId },
      update: {
        ...dataWithoutFotoFrente,
        ...(foto_frente && { foto_frente: String(foto_frente) }),
        ...(bodyFatPercentage !== undefined && { bodyFatPercentage: bodyFatPercentage }),
      },
      create: {
        clientId: clientId,
        ...dataWithoutFotoFrente,
        ...(foto_frente && { foto_frente: String(foto_frente) }),
        ...(bodyFatPercentage !== undefined && { bodyFatPercentage: bodyFatPercentage }),
      },
    });

    return NextResponse.json(
      { 
        anamnesis,
        message: 'Anamnese salva com sucesso' 
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Dados de anamnese inválidos.', errors: error.flatten() }, { status: 400 });
    }
    console.error('Erro ao submeter anamnese presencial:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao submeter anamnese' },
      { status: 500 }
    );
  }
}
