
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/frontend/src/components/ui/button';
import { Input } from '@/frontend/src/components/ui/input';
import { Label } from '@/frontend/src/components/ui/label';
import { Textarea } from '@/frontend/src/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/src/components/ui/card';

interface Diet {
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
}

export default function ClientDietsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [diets, setDiets] = useState<Diet[]>([]);
  const [newDiet, setNewDiet] = useState({
    name: '',
    description: '',
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealStructure: '{}',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      fetchDiets();
    }
  }, [clientId]);

  const fetchDiets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/diets/${clientId}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar dietas.');
      }
      const data = await response.json();
      setDiets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiet(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !clientId) {
      setError('Você precisa estar logado para criar uma dieta.');
      return;
    }

    try {
      const response = await fetch('/api/diets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newDiet,
          clientId,
          nutritionistId: session.user.id,
          totalCalories: parseFloat(String(newDiet.totalCalories)),
          totalProtein: parseFloat(String(newDiet.totalProtein)),
          totalCarbs: parseFloat(String(newDiet.totalCarbs)),
          totalFat: parseFloat(String(newDiet.totalFat)),
          mealStructure: JSON.parse(newDiet.mealStructure),
          active: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar dieta.');
      }

      setNewDiet({
        name: '',
        description: '',
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealStructure: '{}',
      });
      fetchDiets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dietas do Paciente</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Criar Nova Dieta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Dieta</Label>
              <Input id="name" name="name" value={newDiet.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={newDiet.description} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="totalCalories">Calorias</Label>
                <Input id="totalCalories" name="totalCalories" type="number" value={newDiet.totalCalories} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="totalProtein">Proteínas (g)</Label>
                <Input id="totalProtein" name="totalProtein" type="number" value={newDiet.totalProtein} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="totalCarbs">Carboidratos (g)</Label>
                <Input id="totalCarbs" name="totalCarbs" type="number" value={newDiet.totalCarbs} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="totalFat">Gorduras (g)</Label>
                <Input id="totalFat" name="totalFat" type="number" value={newDiet.totalFat} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="mealStructure">Estrutura das Refeições (JSON)</Label>
              <Textarea id="mealStructure" name="mealStructure" value={newDiet.mealStructure} onChange={handleInputChange} rows={10} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Salvar Dieta</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dietas Salvas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando dietas...</p>
          ) : diets.length > 0 ? (
            <ul className="space-y-4">
              {diets.map(diet => (
                <li key={diet.id} className="p-4 border rounded-md">
                  <h3 className="font-bold">{diet.name}</h3>
                  <p>{diet.description}</p>
                  <div className="text-sm text-gray-500">
                    <span>Calorias: {diet.totalCalories}</span> | 
                    <span> Proteínas: {diet.totalProtein}g</span> | 
                    <span> Carboidratos: {diet.totalCarbs}g</span> | 
                    <span> Gorduras: {diet.totalFat}g</span>
                  </div>
                  <small>Criada em: {new Date(diet.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma dieta encontrada para este paciente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
