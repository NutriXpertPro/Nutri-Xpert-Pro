'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Esquema de validação com Zod
const anamnesisSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  wakeTime: z.string().optional(),
  sleepTime: z.string().optional(),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().min(0.1, 'Peso deve ser um número positivo.')
  ),
  height: z.preprocess(
    (val) => Number(val),
    z.number().min(0.1, 'Altura deve ser um número positivo.')
  ),
  goal: z.enum(['Emagrecimento', 'Ganho de massa muscular', 'Ganho de peso', 'Trincar o shape e ganhar massa muscular'], { errorMap: () => ({ message: 'Selecione um objetivo válido.' }) }),
  doenca_familiar: z.string().optional(),
  foto_frente: z.any().optional(), // Para input de arquivo
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
  quadril: z.preprocess((val) => Number(val), z.number().min(0.1, 'Quadril deve ser um número positivo.')).optional(),
  anticoncepcional: z.boolean().optional(),
});

// Tipo inferido do esquema Zod
type AnamnesisData = z.infer<typeof anamnesisSchema>;

interface ClientData {
  id: string;
  name: string;
  // ... outros dados do cliente que você queira exibir
}

export default function FillAnamnesisPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AnamnesisData>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: {
      nome: '',
      wakeTime: '',
      sleepTime: '',
      weight: 0,
      height: 0,
      goal: 'Emagrecimento', // Default para o select
      doenca_familiar: '',
      sexo: 'Masculino', // Default para o select
      ja_fez_dieta: false,
      dieta_resultado: '',
      problema_saude: false,
      problema_saude_descricao: '',
      medicamentos: false,
      medicamentos_descricao: '',
      intolerancia: false,
      intolerancia_descricao: '',
      alcool: false,
      alcool_frequencia: '',
      anabolizante: false,
      anabolizante_problemas: '',
      quadril: 0,
      anticoncepcional: false,
    },
  });

  const watchedSexo = watch('sexo');
  const watchedJaFezDieta = watch('ja_fez_dieta');
  const watchedProblemaSaude = watch('problema_saude');
  const watchedMedicamentos = watch('medicamentos');
  const watchedIntolerancia = watch('intolerancia');
  const watchedAlcool = watch('alcool');
  const watchedAnabolizante = watch('anabolizante');
  const watchedFotoFrente = watch('foto_frente');

  useEffect(() => {
    if (token) {
      const fetchAnamnesisData = async () => {
        try {
          const response = await fetch(`/api/anamnesis/validate-token/${token}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Token inválido ou expirado.');
          }
          const data = await response.json();
          setClientData(data.client);
          // Preenche o formulário com dados existentes ou valores padrão
          reset(data.anamnesis || {});
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAnamnesisData();
    }
  }, [token, reset]);

  const onSubmit = async (data: AnamnesisData) => {
    if (!clientData?.id || !token) return;

    setSubmissionStatus('submitting');
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(`/api/anamnesis/submit-virtual/${clientData.id}?token=${token}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar anamnese.');
      }

      setSubmissionStatus('success');
    } catch (err: any) {
      setError(err.message);
      setSubmissionStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando formulário de anamnese...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="text-xl font-semibold text-red-600 mt-4">Erro</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  if (submissionStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="text-xl font-semibold text-green-600 mt-4">Anamnese Enviada!</h2>
          <p className="text-gray-600 dark:text-gray-300">Sua ficha de anamnese foi enviada com sucesso. Obrigado!</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ficha de Anamnese</CardTitle>
            <CardDescription>Preencha as informações abaixo para sua anamnese. Cliente: {clientData?.name || 'Carregando...'} </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Identificação */}
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" type="text" {...register('nome')} />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
              </div>

              {/* Rotina */}
              <div>
                <Label htmlFor="wakeTime">Horário que acorda</Label>
                <Input id="wakeTime" type="time" {...register('wakeTime')} />
                {errors.wakeTime && <p className="text-red-500 text-sm mt-1">{errors.wakeTime.message}</p>}
              </div>
              <div>
                <Label htmlFor="sleepTime">Horário que dorme</Label>
                <Input id="sleepTime" type="time" {...register('sleepTime')} />
                {errors.sleepTime && <p className="text-red-500 text-sm mt-1">{errors.sleepTime.message}</p>}
              </div>

              {/* Nutrição e Hábitos */}
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" step="0.1" {...register('weight')} />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" step="0.1" {...register('height')} />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>

              {/* Histórico de Saúde */}
              <div>
                <Label htmlFor="doenca_familiar">Doenças na Família (histórico)</Label>
                <Textarea id="doenca_familiar" rows={3} {...register('doenca_familiar')} />
                {errors.doenca_familiar && <p className="text-red-500 text-sm mt-1">{errors.doenca_familiar.message}</p>}
              </div>

              {/* Objetivos */}
              <div>
                <Label htmlFor="goal">Objetivo Principal</Label>
                <select id="goal" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register('goal')}>
                  <option value="">Selecione</option>
                  <option value="Emagrecimento">Emagrecimento</option>
                  <option value="Ganho de massa muscular">Ganho de massa muscular</option>
                  <option value="Ganho de peso">Ganho de peso</option>
                  <option value="Trincar o shape e ganhar massa muscular">Trincar o shape e ganhar massa muscular</option>
                </select>
                {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>}
              </div>

              {/* Fotos */}
              <div>
                <Label htmlFor="foto_frente">Foto (Frente)</Label>
                <Input id="foto_frente" type="file" accept="image/*" {...register('foto_frente')} />
                {watch('foto_frente') && watch('foto_frente')[0] && (
                  <p className="text-sm text-gray-500 mt-1">Arquivo selecionado: {watch('foto_frente')[0].name}</p>
                )}
                {errors.foto_frente && <p className="text-red-500 text-sm mt-1">{errors.foto_frente.message}</p>}
              </div>

              {/* Campos Condicionais */}
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <select id="sexo" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register('sexo')}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.sexo && <p className="text-red-500 text-sm mt-1">{errors.sexo.message}</p>}
              </div>

              {watch('sexo') === 'Feminino' && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="quadril">Medida do Quadril (cm)</Label>
                    <Input id="quadril" type="number" step="0.1" {...register('quadril')} />
                    {errors.quadril && <p className="text-red-500 text-sm mt-1">{errors.quadril.message}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="anticoncepcional" {...register('anticoncepcional')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <Label htmlFor="anticoncepcional">Faz uso de anticoncepcional?</Label>
                  </div>
                  {errors.anticoncepcional && <p className="text-red-500 text-sm mt-1">{errors.anticoncepcional.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ja_fez_dieta" {...register('ja_fez_dieta')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="ja_fez_dieta">Já fez dieta antes?</Label>
              </div>
              {errors.ja_fez_dieta && <p className="text-red-500 text-sm mt-1">{errors.ja_fez_dieta.message}</p>}

              {watch('ja_fez_dieta') && (
                <div>
                  <Label htmlFor="dieta_resultado">Qual foi o resultado?</Label>
                  <Textarea id="dieta_resultado" rows={3} {...register('dieta_resultado')} />
                  {errors.dieta_resultado && <p className="text-red-500 text-sm mt-1">{errors.dieta_resultado.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="problema_saude" {...register('problema_saude')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="problema_saude">Possui algum problema de saúde?</Label>
              </div>
              {errors.problema_saude && <p className="text-red-500 text-sm mt-1">{errors.problema_saude.message}</p>}

              {watch('problema_saude') && (
                <div>
                  <Label htmlFor="problema_saude_descricao">Qual problema de saúde?</Label>
                  <Textarea id="problema_saude_descricao" rows={3} {...register('problema_saude_descricao')} />
                  {errors.problema_saude_descricao && <p className="text-red-500 text-sm mt-1">{errors.problema_saude_descricao.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="medicamentos" {...register('medicamentos')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="medicamentos">Faz uso de algum medicamento?</Label>
              </div>
              {errors.medicamentos && <p className="text-red-500 text-sm mt-1">{errors.medicamentos.message}</p>}

              {watch('medicamentos') && (
                <div>
                  <Label htmlFor="medicamentos_descricao">Quais medicamentos?</Label>
                  <Textarea id="medicamentos_descricao" rows={3} {...register('medicamentos_descricao')} />
                  {errors.medicamentos_descricao && <p className="text-red-500 text-sm mt-1">{errors.medicamentos_descricao.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="intolerancia" {...register('intolerancia')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="intolerancia">Possui alguma intolerância alimentar?</Label>
              </div>
              {errors.intolerancia && <p className="text-red-500 text-sm mt-1">{errors.intolerancia.message}</p>}

              {watch('intolerancia') && (
                <div>
                  <Label htmlFor="intolerancia_descricao">Qual intolerância?</Label>
                  <Textarea id="intolerancia_descricao" rows={3} {...register('intolerancia_descricao')} />
                  {errors.intolerancia_descricao && <p className="text-red-500 text-sm mt-1">{errors.intolerancia_descricao.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="alcool" {...register('alcool')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="alcool">Faz uso de álcool?</Label>
              </div>
              {errors.alcool && <p className="text-red-500 text-sm mt-1">{errors.alcool.message}</p>}

              {watch('alcool') && (
                <div>
                  <Label htmlFor="alcool_frequencia">Com que frequência?</Label>
                  <Input id="alcool_frequencia" type="text" {...register('alcool_frequencia')} />
                  {errors.alcool_frequencia && <p className="text-red-500 text-sm mt-1">{errors.alcool_frequencia.message}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="anabolizante" {...register('anabolizante')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <Label htmlFor="anabolizante">Faz uso de anabolizantes?</Label>
              </div>
              {errors.anabolizante && <p className="text-red-500 text-sm mt-1">{errors.anabolizante.message}</p>}

              {watch('anabolizante') && (
                <div>
                  <Label htmlFor="anabolizante_problemas">Quais problemas de saúde relacionados?</Label>
                  <Textarea id="anabolizante_problemas" rows={3} {...register('anabolizante_problemas')} />
                  {errors.anabolizante_problemas && <p className="text-red-500 text-sm mt-1">{errors.anabolizante_problemas.message}</p>}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submissionStatus === 'submitting'}>
                {submissionStatus === 'submitting' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  'Enviar Anamnese'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
