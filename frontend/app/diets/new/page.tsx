'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/frontend/src/components/ui/button';
import { Input } from '@/frontend/src/components/ui/input';
import { Label } from '@/frontend/src/components/ui/label';
import { Textarea } from '@/frontend/src/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/frontend/src/components/ui/form';

const formSchema = z.object({
  dietName: z.string().min(1, { message: 'O nome da dieta é obrigatório.' }),
  patientId: z.string().min(1, { message: 'Selecione um paciente.' }), // Placeholder for patient selection
  objective: z.string().optional(),
  notes: z.string().optional(),
});

export default function CreateDietPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietName: '',
      patientId: '',
      objective: '',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Placeholder for API call to create diet
      console.log('Creating diet with values:', values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Dieta criada com sucesso! (Simulado)');
      router.push('/dashboard/diets'); // Redirect to diets list
    } catch (error) {
      console.error('Error creating diet:', error);
      alert('Erro ao criar dieta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Criar Nova Dieta</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dietName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Dieta</FormLabel>
                  <FormControl>
                    <Input placeholder="Dieta para Ganho de Massa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Placeholder for Patient Selection */}
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    {/* In a real app, this would be a Select or Autocomplete component */}
                    <Input placeholder="ID do Paciente (ex: 123)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo da Dieta (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Perda de peso, ganho de massa, manutenção" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Quaisquer notas adicionais sobre a dieta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Dieta'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
