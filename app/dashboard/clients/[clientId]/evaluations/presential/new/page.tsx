'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../components/ui/card";
import { Button } from "../../../../../../../components/ui/button";
import { Input } from "../../../../../../../components/ui/input";
import { Label } from "../../../../../../../components/ui/label";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const evaluationSchema = z.object({
  weight: z.preprocess((val) => Number(val), z.number().min(0.1, 'Peso deve ser um número positivo.')),
  neck: z.preprocess((val) => Number(val), z.number().min(0.1, 'Pescoço deve ser um número positivo.')),
  waist: z.preprocess((val) => Number(val), z.number().min(0.1, 'Cintura deve ser um número positivo.')),
  hip: z.preprocess((val) => Number(val), z.number().optional()),
  nextEvaluationDate: z.string().min(1, 'Data da próxima avaliação é obrigatória.'),
  notes: z.string().optional(),
  photo_front: z.any().optional(),
  photo_side: z.any().optional(),
  photo_back: z.any().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

export default function NewPresentialEvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
  });

  const onSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('clientId', clientId);
    formData.append('weight', data.weight.toString());
    formData.append('neck', data.neck.toString());
    formData.append('waist', data.waist.toString());
    if (data.hip) {
      formData.append('hip', data.hip.toString());
    }
    formData.append('nextEvaluationDate', data.nextEvaluationDate);
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (data.photo_front && data.photo_front[0]) {
      formData.append('photo_front', data.photo_front[0]);
    }
    if (data.photo_side && data.photo_side[0]) {
      formData.append('photo_side', data.photo_side[0]);
    }
    if (data.photo_back && data.photo_back[0]) {
      formData.append('photo_back', data.photo_back[0]);
    }

    try {
      const response = await fetch('/api/evaluations/presential/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar avaliação presencial.');
      }

      router.push(`/dashboard/clients/${clientId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Nova Avaliação Presencial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" step="0.1" {...register('weight')} />
                  {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                </div>
                <div>
                  <Label htmlFor="neck">Pescoço (cm)</Label>
                  <Input id="neck" type="number" step="0.1" {...register('neck')} />
                  {errors.neck && <p className="text-red-500 text-sm mt-1">{errors.neck.message}</p>}
                </div>
                <div>
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input id="waist" type="number" step="0.1" {...register('waist')} />
                  {errors.waist && <p className="text-red-500 text-sm mt-1">{errors.waist.message}</p>}
                </div>
                <div>
                  <Label htmlFor="hip">Quadril (cm) (Opcional)</Label>
                  <Input id="hip" type="number" step="0.1" {...register('hip')} />
                  {errors.hip && <p className="text-red-500 text-sm mt-1">{errors.hip.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="nextEvaluationDate">Data da Próxima Avaliação</Label>
                <Input id="nextEvaluationDate" type="date" {...register('nextEvaluationDate')} />
                {errors.nextEvaluationDate && <p className="text-red-500 text-sm mt-1">{errors.nextEvaluationDate.message}</p>}
              </div>

              <div>
                <Label>Fotos</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="photo_front">Frente</Label>
                    <Input id="photo_front" type="file" accept="image/*" {...register('photo_front')} />
                  </div>
                  <div>
                    <Label htmlFor="photo_side">Lado</Label>
                    <Input id="photo_side" type="file" accept="image/*" {...register('photo_side')} />
                  </div>
                  <div>
                    <Label htmlFor="photo_back">Costas</Label>
                    <Input id="photo_back" type="file" accept="image/*" {...register('photo_back')} />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" rows={4} {...register('notes')} />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Avaliação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}