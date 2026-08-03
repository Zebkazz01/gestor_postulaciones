"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, CircleNotch, Key } from "@phosphor-icons/react";
import {
  PasswordStrengthChecker,
  isPasswordStrong,
} from "@/components/features/PasswordStrengthChecker";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [registerPassword, setRegisterPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

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
        const isInvalidCreds = error.message === "Invalid login credentials";
        toast.add({
          title: isInvalidCreds
            ? "Cuenta no encontrada o credenciales incorrectas"
            : "Error al iniciar sesión",
          description: isInvalidCreds
            ? "No existe una cuenta activa con esta contraseña. Redirigiendo para registrarte..."
            : error.message,
          type: "error",
        });

        if (isInvalidCreds) {
          setActiveTab("register");
        }
        return;
      }

      toast.add({
        title: "Bienvenido de vuelta",
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
        description: "Verifica que ambas contraseñas sean exactamente iguales",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.add({
        title: "Contraseña poco segura",
        description: "Por favor asegúrate de cumplir con todos los requisitos de seguridad requeridos.",
        type: "warning",
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

        const isRateLimited =
          error.message.toLowerCase().includes("rate limit") ||
          error.status === 429;

        toast.add({
          title: isRateLimited
            ? "Límite de correos alcanzado"
            : isAlreadyRegistered
            ? "Esta cuenta ya existe"
            : "Error al registrarse",
          description: isRateLimited
            ? "Supabase ha alcanzado el límite de envío de correos para esta cuenta por seguridad. Por favor, espera 5 minutos o prueba con otro correo electrónico."
            : isAlreadyRegistered
            ? "Este correo electrónico ya está registrado. Por favor, inicia sesión en la pestaña de 'Iniciar Sesión'."
            : error.message,
          type: isRateLimited ? "warning" : "error",
        });
        return;
      }

      if (
        data?.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        toast.add({
          title: "Esta cuenta ya existe",
          description:
            "Este correo electrónico ya está registrado. Por favor, inicia sesión en la pestaña de 'Iniciar Sesión'.",
          type: "warning",
        });
        return;
      }

      toast.add({
        title: "Cuenta creada con éxito",
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

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsResetLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("reset-email") as string;

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        toast.add({
          title: "Error al enviar correo",
          description: error.message,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Correo de recuperación enviado",
        description:
          "Revisa tu bandeja de entrada para hacer clic en el enlace y restablecer tu contraseña.",
        type: "success",
      });

      setForgotDialogOpen(false);
    } catch {
      toast.add({
        title: "Error inesperado",
        description: "Inténtalo de nuevo más tarde",
        type: "error",
      });
    } finally {
      setIsResetLoading(false);
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
          <Briefcase className="h-5 w-5" weight="bold" />
        </div>
        PostulaYa
      </Link>

      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "register")}>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <button
                      type="button"
                      onClick={() => setForgotDialogOpen(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <PasswordInput
                    id="login-password"
                    name="password"
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
                      <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
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
                  <PasswordInput
                    id="register-password"
                    name="password"
                    placeholder="Contraseña segura"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <PasswordStrengthChecker password={registerPassword} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">
                    Confirmar Contraseña
                  </Label>
                  <PasswordInput
                    id="register-confirm"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    required
                    disabled={isLoading}
                    minLength={8}
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
                      <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Key className="h-5 w-5" weight="bold" />
            </div>
            <DialogTitle className="text-center">
              Recuperar contraseña
            </DialogTitle>
            <DialogDescription className="text-center">
              Ingresa tu correo electrónico registrado y te enviaremos un enlace
              para cambiar tu contraseña.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Correo Electrónico</Label>
              <Input
                id="reset-email"
                name="reset-email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={isResetLoading}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotDialogOpen(false)}
                disabled={isResetLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isResetLoading}>
                {isResetLoading ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Enlace"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
