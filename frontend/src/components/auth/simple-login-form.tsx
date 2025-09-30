"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

interface SimpleLoginFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  onGoogleLogin?: () => void;
  borderColor: 'green' | 'blue';
}

export function SimpleLoginForm({
  onSubmit,
  isLoading,
  onGoogleLogin,
  borderColor
}: SimpleLoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const borderClass = borderColor === 'green' 
    ? 'border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
    : 'border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image 
            src="/assets/logo.png" 
            alt="Nutri Xpert Pro" 
            width={64} 
            height={64}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Entrar no Nutri Xpert Pro
          </h2>
        </div>

        <div className={`mt-8 p-8 border-2 rounded-lg ${borderClass}`}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Usuário ou endereço de email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="********"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
          </div>

          {onGoogleLogin && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.78 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.24-.73-.38-1.5-.38-2.31 0-.81.14-1.58.38-2.31H2.18V7.07c-3.25 1.56-5.46 4.78-5.46 8.56s2.21 6.99 5.46 8.56v-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.47 2.09 14.4 1 12 1c-2.4 0-5.47 1.09-7.24 2.86l3.15 3.15c1.15-1.08 2.59-1.64 4.21-1.64z"/>
                </svg>
                Continuar com Google
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Novo no Nutri Xpert Pro?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-500">
                Criar nova conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
