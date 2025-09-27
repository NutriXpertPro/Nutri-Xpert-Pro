
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { toast } from 'react-hot-toast';

export default function EvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const { clientId: evaluationId } = params;

  const [formData, setFormData] = useState({
    weight: '',
    neck: '',
    waist: '',
    hip: '',
  });
  const [photos, setPhotos] = useState<Record<string, File | null>>({
    frontPhoto: null,
    sidePhoto: null,
    backPhoto: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhotos({ ...photos, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      Object.entries(photos).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      const response = await fetch(`/api/evaluation/${evaluationId}`,
        {
          method: 'POST',
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar avaliação.');
      }

      toast.success('Avaliação enviada com sucesso!');
      router.push('/dashboard'); // Redirect to a success or dashboard page

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Avaliação Quinzenal</CardTitle>
          <CardDescription>Preencha suas medidas e envie suas fotos para acompanhamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neck">Pescoço (cm)</Label>
                <Input id="neck" name="neck" type="number" step="0.1" value={formData.neck} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input id="waist" name="waist" type="number" step="0.1" value={formData.waist} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hip">Quadril (cm)</Label>
                <Input id="hip" name="hip" type="number" step="0.1" value={formData.hip} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="frontPhoto">Foto de Frente</Label>
                <Input id="frontPhoto" name="frontPhoto" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <div>
                <Label htmlFor="sidePhoto">Foto de Lado</Label>
                <Input id="sidePhoto" name="sidePhoto" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <div>
                <Label htmlFor="backPhoto">Foto de Costas</Label>
                <Input id="backPhoto" name="backPhoto" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
