'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export default function PatientLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/patient-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the API returns a token and user info
        // You might want to store the token in a cookie or local storage
        // For now, just redirect
        router.push("/patient/dashboard");
      } else {
        alert(data.message || "Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-12">
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        // Removed social login props for patient login for now
      />
    </div>
  );
}
