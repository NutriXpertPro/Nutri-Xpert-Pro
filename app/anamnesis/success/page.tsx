// app/anamnesis/success/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnamnesisSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
            Anamnese enviada com sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Sua ficha foi registrada corretamente
            {id && <> para o cliente <strong>{id}</strong></>}.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}