'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { toast } from 'react-hot-toast';

interface PendingNutritionist {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
}

export default function AdminNutritionistPage() {
  const [nutritionists, setNutritionists] = useState<PendingNutritionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingNutritionists();
  }, []);

  const fetchPendingNutritionists = async () => {
    try {
      const response = await fetch('/backend/src/api/admin/nutritionists/pending');
      const data = await response.json();
      setNutritionists(data.nutritionists || []);
    } catch (error) {
      console.error('Erro ao buscar nutricionistas:', error);
      toast.error('Erro ao buscar nutricionistas pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (nutritionistId: string) => {
    setActionLoading(nutritionistId);
    try {
      const response = await fetch('/backend/src/api/admin/nutritionists/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nutritionistId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Nutricionista aprovado com sucesso!');
        fetchPendingNutritionists();
      } else {
        toast.error(data.message || 'Erro ao aprovar nutricionista');
      }
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast.error('Erro ao aprovar nutricionista');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (nutritionistId: string) => {
    const reason = prompt('Digite o motivo da rejeição (opcional):');
    
    setActionLoading(nutritionistId);
    try {
      const response = await fetch('/backend/src/api/admin/nutritionists/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nutritionistId, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Nutricionista rejeitado');
        fetchPendingNutritionists();
      } else {
        toast.error(data.message || 'Erro ao rejeitar nutricionista');
      }
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      toast.error('Erro ao rejeitar nutricionista');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Gerenciar Nutricionistas</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Nutricionistas Pendentes</h1>
      
      {nutritionists.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">Nenhum nutricionista pendente de aprovação</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {nutritionists.map((nutritionist) => (
            <Card key={nutritionist.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{nutritionist.name || 'Sem nome'}</h3>
                  <p className="text-gray-600">{nutritionist.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Cadastrado em: {new Date(nutritionist.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  {nutritionist.stripeCurrentPeriodEnd && (
                    <p className="text-sm text-gray-500">
                      Assinatura até: {new Date(nutritionist.stripeCurrentPeriodEnd).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(nutritionist.id)}
                    disabled={actionLoading === nutritionist.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === nutritionist.id ? 'Processando...' : 'Aprovar'}
                  </Button>
                  <Button
                    onClick={() => handleReject(nutritionist.id)}
                    disabled={actionLoading === nutritionist.id}
                    variant="destructive"
                  >
                    {actionLoading === nutritionist.id ? 'Processando...' : 'Rejeitar'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
