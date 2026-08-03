"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.add({
          title: "Error al iniciar sesión",
          description: error.message === "Invalid login credentials"
            ? "Email o contraseña incorrectos"
            : error.message,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "¡Bienvenido de vuelta!",
        description: "Redirigiendo al dashboard...",
        type: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.add({
        title: "Error inesperado",
        description: "Inténtalo de nuevo más tarde",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.add({
        title: "Las contraseñas no coinciden",
        description: "Verifica que ambas contraseñas sean iguales",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.add({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        const isAlreadyRegistered =
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user already") ||
          error.status === 422;

        toast.add({
          title: isAlreadyRegistered ? "Esta cuenta ya existe" : "Error al registrarse",
          description: isAlreadyRegistered
            ? "Este correo electrónico ya está registrado. Por favor, inicia sesión en la pestaña de 'Iniciar Sesión'."
            : error.message,
          type: "error",
        });
        return;
      }

      // Supabase default protection: if user already exists, signUp returns user with empty identities array
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast.add({
          title: "Esta cuenta ya existe",
          description: "Este correo electrónico ya está registrado. Por favor, inicia sesión en la pestaña de 'Iniciar Sesión'.",
          type: "warning",
        });
        return;
      }

      toast.add({
        title: "¡Cuenta creada con éxito!",
        description: "Tu cuenta ha sido creada. Accediendo al dashboard...",
        type: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.add({
        title: "Error inesperado",
        description: "Inténtalo de nuevo más tarde",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4">
      {/* Logo / Brand */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Briefcase className="h-5 w-5" />
        </div>
        PostulaYa
      </Link>

      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <Tabs defaultValue="login">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-2xl">
              Accede a tu cuenta
            </CardTitle>
            <CardDescription className="text-center">
              Gestiona tus postulaciones laborales desde un solo lugar
            </CardDescription>
            <TabsList className="mt-4 grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* Sign In Form */}
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={isLoading}
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="register-confirm"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    required
                    disabled={isLoading}
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta Gratis"
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
