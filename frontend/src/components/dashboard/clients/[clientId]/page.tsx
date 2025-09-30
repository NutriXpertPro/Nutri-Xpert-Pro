'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { ArrowLeft, User, Mail, Phone, Briefcase, StickyNote, Edit, Save, X, Calendar, Weight, CheckCircle, AlertTriangle, Clock, Clipboard, Loader2, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Esquema de validação com Zod (replicando o do frontend)
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

// Interfaces based on Prisma schema
interface Evaluation {
  id: string;
  weight: number | null;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  createdAt: string;
}

interface Anamnesis {
  id: string;
  clientId: string;
  nome: string;
  wakeTime?: string;
  sleepTime?: string;
  weight?: number;
  height?: number;
  goal?: string;
  doenca_familiar?: string;
  foto_frente?: string; // Assuming URL for stored image
  sexo?: string;
  ja_fez_dieta?: boolean;
  dieta_resultado?: string;
  problema_saude?: boolean;
  problema_saude_descricao?: string;
  medicamentos?: boolean;
  medicamentos_descricao?: string;
  intolerancia?: boolean;
  intolerancia_descricao?: string;
  alcool?: boolean;
  alcool_frequencia?: string;
  anabolizante?: boolean;
  anabolizante_problemas?: string;
  quadril?: number;
  anticoncepcional?: boolean;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  sex?: string;
  profession?: string;
  notes?: string;
  createdAt: string;
  evaluations: Evaluation[];
  anamnesis?: Anamnesis | null; // Add anamnesis to client interface
}

interface PhotoData {
  url: string;
  createdAt: string;
  evaluationDate?: string; // Assuming ISO string from backend
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [anamnesisLink, setAnamnesisLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [anamnesisSubmissionStatus, setAnamnesisSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [photos, setPhotos] = useState<PhotoData[]>([]);

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

  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloadingReport(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/report`);
      if (!response.ok) {
        throw new Error('Falha ao gerar o relatório em PDF.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${client?.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!client?.id) return;
    setGeneratingLink(true);
    setLinkError(null);
    setAnamnesisLink(null);
    try {
      const response = await fetch(`/api/anamnesis/generate-link/${client.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao gerar link de anamnese.');
      }
      const data = await response.json();
      setAnamnesisLink(data.link);
    } catch (err: any) {
      setLinkError(err.message);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (anamnesisLink) {
      navigator.clipboard.writeText(anamnesisLink);
      // Optionally, show a toast notification
      alert('Link copiado para a área de transferência!');
    }
  };

  useEffect(() => {
    if (clientId) {
      const fetchClientAndAnamnesis = async () => {
        try {
          const clientResponse = await fetch(`/api/clients/${clientId}`);
          if (!clientResponse.ok) {
            throw new Error('Cliente não encontrado ou não autorizado.');
          }
          const clientData = await clientResponse.json();
          setClient(clientData.client);
          setFormData(clientData.client);

          // Fetch existing anamnesis data
          const anamnesisResponse = await fetch(`/api/anamnesis/${clientId}`); // Assuming an API to fetch anamnesis by clientId
          if (anamnesisResponse.ok) {
            const anamnesisData = await anamnesisResponse.json();
            reset(anamnesisData.anamnesis || {});
          }

        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchClientAndAnamnesis();
    }
  }, [clientId, reset]);

  useEffect(() => {
    if (clientId) {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(`/api/clients/${clientId}/evaluations/photos`);
          if (!response.ok) {
            throw new Error('Failed to fetch photos.');
          }
          const data: PhotoData[] = await response.json();
          setPhotos(data);
        } catch (err: any) {
          console.error('Error fetching photos:', err);
          // Optionally set an error state for photos specifically
        }
      };
      fetchPhotos();
    }
  }, [clientId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/clients/${clientId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, age: formData.age ? Number(formData.age) : null }),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao atualizar o cliente.');
      }

      const data = await response.json();
      setClient(data.client);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const onAnamnesisSubmit = async (data: AnamnesisData) => {
    if (!client?.id) return;

    setAnamnesisSubmissionStatus('submitting');
    setError(null);

    try {
      const response = await fetch(`/api/anamnesis/create-presential/${client.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar anamnese.');
      }

      setAnamnesisSubmissionStatus('success');
      // Optionally, refetch client data to update anamnesis field
      // router.refresh();
    } catch (err: any) {
      setError(err.message);
      setAnamnesisSubmissionStatus('error');
    }
  };

  const EvaluationStatusIcon = ({ status }: { status: Evaluation['status'] }) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Erro</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <Button onClick={() => router.push('/dashboard/clients')} className="mt-4">
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={() => router.push('/dashboard/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a Lista
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} disabled={isDownloadingReport}>
              {isDownloadingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Baixar Relatório
            </Button>
            <Button onClick={() => router.push(`/dashboard/clients/${clientId}/evaluations/presential/new`)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Avaliação Presencial
            </Button>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                {isEditing ? (
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl font-bold"
                  />
                ) : (
                  client.name
                )}
              </CardTitle>
              <CardDescription>ID do Cliente: {client.id}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold">Dados Pessoais</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input id="age" type="number" value={formData.age || ''} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label htmlFor="sex">Sexo</Label>
                      <Input id="sex" value={formData.sex || ''} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} />
                    </div>
                     <div>
                      <Label htmlFor="profession">Profissão</Label>
                      <Input id="profession" value={formData.profession || ''} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{client.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{client.phone || 'N/A'}</span>
                    </div>
                    <p><strong>Idade:</strong> {client.age || 'N/A'}</p>
                    <p><strong>Sexo:</strong> {client.sex || 'N/A'}</p>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{client.profession || 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Observações</h3>
                {isEditing ? (
                  <Textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={5}
                  />
                ) : (
                  <div className="flex items-start">
                    <StickyNote className="h-4 w-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{client.notes || 'Nenhuma observação.'}</p>
                  </div>
                )}
              </div>
            </CardContent>
            {isEditing && (
              <div className="p-6 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            )}
          </Card>
        </form>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Anamnese Virtual</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">Gere um link único para que o paciente possa preencher a ficha de anamnese online.</p>
                <Button onClick={handleGenerateLink} disabled={generatingLink}>
                  {generatingLink ? 'Gerando Link...' : 'Gerar Link de Anamnese'}
                </Button>
                {linkError && <p className="text-red-500 text-sm mt-2">{linkError}</p>}
                {anamnesisLink && (
                  <div className="flex items-center space-x-2 mt-4">
                    <Input type="text" value={anamnesisLink} readOnly className="flex-grow" />
                    <Button onClick={handleCopyLink} variant="outline" size="icon">
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Section for Presential Anamnesis */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Anamnese Presencial</h2>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onAnamnesisSubmit)} className="space-y-6">
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
                  {watchedFotoFrente && watchedFotoFrente[0] && (
                    <p className="text-sm text-gray-500 mt-1">Arquivo selecionado: {watchedFotoFrente[0].name}</p>
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

                {watchedSexo === 'Feminino' && (
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

                {watchedJaFezDieta && (
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

                {watchedProblemaSaude && (
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

                {watchedMedicamentos && (
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

                {watchedIntolerancia && (
                  <div>
                    <Label htmlFor="intolerancia_descricao">Qual intolerância?</Label>
                    <Textarea id="intolerancia_descricao" rows={3} {...register('intolerancia_descricao')} />
                    {errors.intolerancia_descricao && <p className="text-red-500 text-sm mt-1">{errors.intolerancia_descricao.message}</p>}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="alcool" {...register('alcool')} className="h-4 w-4 text-blue-600 focus:ring-ring border-gray-300 rounded" />
                  <Label htmlFor="alcool">Faz uso de álcool?</Label>
                </div>
                {errors.alcool && <p className="text-red-500 text-sm mt-1">{errors.alcool.message}</p>}

                {watchedAlcool && (
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

                {watchedAnabolizante && (
                  <div>
                    <Label htmlFor="anabolizante_problemas">Quais problemas de saúde relacionados?</Label>
                    <Textarea id="anabolizante_problemas" rows={3} {...register('anabolizante_problemas')} />
                    {errors.anabolizante_problemas && <p className="text-red-500 text-sm mt-1">{errors.anabolizante_problemas.message}</p>}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={anamnesisSubmissionStatus === 'submitting'}>
                  {anamnesisSubmissionStatus === 'submitting' ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando Anamnese...</>
                  ) : (
                    'Salvar Anamnese Presencial'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Histórico de Avaliações</h2>
          <Card>
            <CardContent className="pt-6">
              {client.evaluations && client.evaluations.length > 0 ? (
                <ul className="space-y-4">
                  {client.evaluations.map((evaluation) => (
                    <li key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-semibold">{new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Status: {evaluation.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {evaluation.weight && (
                          <div className="flex items-center mr-4">
                            <Weight className="h-5 w-5 mr-2 text-gray-500" />
                            <span>{evaluation.weight} kg</span>
                          </div>
                        )}
                        <EvaluationStatusIcon status={evaluation.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">Nenhuma avaliação encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
