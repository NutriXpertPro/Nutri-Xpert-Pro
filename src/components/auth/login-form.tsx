"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  twoFactorCode: z.string().optional(),
});

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void; // Removido Promise<void> para compatibilidade com handleSubmit
  isLoading: boolean;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onWebAuthnLogin?: () => void;
  showTwoFactorInput?: boolean;
}

export function LoginForm({
  onSubmit,
  isLoading,
  onGoogleLogin,
  onFacebookLogin,
  onWebAuthnLogin,
  showTwoFactorInput = false,
}: LoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
  });

  // Função wrapper para lidar com a assincronicidade
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values); // Chama a função onSubmit passada como prop
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background/40 backdrop-blur-md border-border/20 shadow-2xl rounded-xl relative overflow-hidden transform-gpu transition-all duration-500 hover:scale-[1.01] hover:shadow-primary/30">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <Image src="/assets/logo.png" alt="Nutri Xpert Pro" width={100} height={100} />
        </div>
        <CardTitle className="text-3xl font-extrabold text-white drop-shadow-lg">
          Entrar no Nutri Xpert Pro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!showTwoFactorInput && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Usuário ou e-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-white">Senha</FormLabel>
                        <a href="/forgot-password" className="text-primary hover:underline">
                          Esqueceu a senha?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {showTwoFactorInput && (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Código 2FA</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormDescription className="text-white">
                      Insira o código de autenticação de dois fatores.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-white">
              ou
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {onGoogleLogin && (
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={onGoogleLogin}
              disabled={isLoading}
            >
              <svg width="22" height="22" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.5 16.1c0-.9-.1-1.8-.3-2.6H16.2v5h8.8c-.4 2.2-1.7 3.9-3.7 5.1v3.3h4.3c2.5-2.3 4-5.7 4-9.7z" fill="#4285f4"/>
                <path d="M16.2 32c4.4 0 8.1-1.4 10.8-3.9l-4.3-3.3c-1.2.8-2.7 1.3-4.5 1.3-3.5 0-6.5-2.4-7.6-5.6H4.3v3.4c2.2 4.3 6.6 7.4 11.9 7.4z" fill="#34a853"/>
                <path d="M8.6 19.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V12.3H4.3c-.6 1.2-.9 2.6-.9 4s.3 2.8.9 4.1l4.3 3.4z" fill="#fbbc05"/>
                <path d="M16.2 10.5c1.9 0 3.5.7 4.8 1.9l3.8-3.8c-2.3-2.2-5.3-3.5-8.6-3.5-5.3 0-9.7 3.1-11.9 7.4l4.3 3.4c1.1-3.2 4.1-5.6 7.6-5.6z" fill="#ea4335"/>
              </svg>
              <span className="text-white">Continuar com Google</span>
            </Button>
          )}

          {onWebAuthnLogin && (
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={onWebAuthnLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fingerprint"><path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"/><path d="M12 22C14.7614 22 17 19.7614 17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17C7 19.7614 9.23858 22 12 22Z"/><path d="M12 17V12"/><path d="M12 12H17"/><path d="M12 12H7"/><path d="M12 7V2"/><path d="M12 22V17"/><path d="M17 12H22"/><path d="M7 12H2"/></svg>
              Entrar com Biometria
            </Button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-white">
          <p>Novo no Nutri Xpert Pro? <a href="/register" className="text-primary hover:underline">Criar nova conta</a></p>
          <p className="mt-2">Entre com uma senha</p>
          <p className="mt-2"><a href="#" className="text-primary hover:underline">Sair</a></p>
        </div>
      </CardContent>
    </Card>
  );
}