"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function AnamnesisSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-green-600">
            <CheckCircle className="h-full w-full" />
          </div>
          <CardTitle className="text-green-700">Anamnese Enviada!</CardTitle>
          <CardDescription>
            Sua ficha de anamnese foi enviada com sucesso para o nutricionista.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 text-center">
            <p>✅ Dados pessoais registrados</p>
            <p>✅ Informações de saúde coletadas</p>
            <p>✅ Medidas e fotos enviadas</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Próximos passos:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seu nutricionista analisará as informações</li>
              <li>• Você receberá avaliações quinzenais por email</li>
              <li>• Sua dieta personalizada será criada em breve</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/clients')}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            {clientId && (
              <Button 
                onClick={() => router.push(`/dashboard/clients/${clientId}`)}
                className="flex-1"
              >
                Ver Cliente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
