'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, PlusCircle, Save, Trash2 } from 'lucide-react';
import FoodSearch from '../components/FoodSearch';

interface Client {
  id: string;
  name: string;
}

const foodSchema = z.object({
  foodId: z.string(),
  name: z.string(),
  quantity: z.preprocess((val) => Number(val), z.number().min(0.1, 'Quantidade deve ser positiva.')),
});

const mealSchema = z.object({
  name: z.string().min(1, 'Nome da refeição é obrigatório.'),
  foods: z.array(foodSchema),
});

const dietSchema = z.object({
  clientId: z.string().min(1, 'Selecione um paciente.'),
  name: z.string().min(1, 'Nome da dieta é obrigatório.'),
  description: z.string().optional(),
  meals: z.array(mealSchema),
});

type DietFormData = z.infer<typeof dietSchema>;

function Meal({ mealIndex, control, register, errors }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `meals.${mealIndex}.foods`
    });

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <Input {...register(`meals.${mealIndex}.name`)} placeholder="Nome da Refeição (ex: Café da Manhã)" className="font-semibold" />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(mealIndex)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </div>
            {errors.meals?.[mealIndex]?.name && <p className="text-red-500 text-sm mb-2">{errors.meals?.[mealIndex]?.name?.message}</p>}

            <div className="mt-4">
                <FoodSearch onFoodSelect={(food) => append({ foodId: food.id, name: food.name, quantity: 100 })} />
            </div>

            <div className="mt-4 space-y-2">
                {fields.map((food, foodIndex) => (
                    <div key={food.id} className="flex items-center gap-2">
                        <span>{food.name}</span>
                        <Input {...register(`meals.${mealIndex}.foods.${foodIndex}.quantity`)} type="number" step="0.1" className="w-24" />
                        <span>g</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(foodIndex)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CreateDietPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, control } = useForm<DietFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      meals: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meals",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Falha ao buscar clientes.');
        }
        const data = await response.json();
        setClients(data.clients);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data: DietFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/diets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar dieta.');
      }

      router.push('/dashboard/diets');
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
            <CardTitle>Criar Nova Dieta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Paciente</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>}
                  </div>
                )}
              />

              <div>
                <Label htmlFor="name">Nome da Dieta</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea id="description" {...register('description')} />
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Refeições</h3>
                    <Button type="button" variant="outline" onClick={() => append({ name: '', foods: [] })}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Adicionar Refeição
                    </Button>
                </div>
                
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Meal key={field.id} mealIndex={index} control={control} register={register} errors={errors} />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Dieta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}