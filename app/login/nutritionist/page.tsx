'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export default function NutritionistLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    }).then((result) => {
      setIsLoading(false);
      if (result?.error) {
        alert("Email ou senha inválidos");
      } else {
        router.push("/dashboard");
      }
    });
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleFacebookLogin = () => {
    signIn("facebook", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex justify-center py-12">
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
      />
    </div>
  );
}