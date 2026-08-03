"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthChecker, isPasswordStrong } from "@/components/features/PasswordStrengthChecker";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleNotch, Warning, Briefcase, EnvelopeSimple, ArrowLeft } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [rateLimitError, setRateLimitError] = useState(false);

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
            ? "Correo o contraseña incorrectos"
            : "Error al iniciar sesión",
          description: isInvalidCreds
            ? "No se encontró una cuenta activa con esas credenciales. Verifica tus datos o regístrate si no tienes cuenta."
            : error.message,
          type: "error",
        });
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
    setRateLimitError(false);

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
        const isRateLimited =
          error.message.toLowerCase().includes("rate limit") ||
          error.status === 429;

        if (isRateLimited) {
          setRateLimitError(true);

          // Try automatic sign in if account was already created
          const signInAttempt = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInAttempt.error && signInAttempt.data.session) {
            toast.add({
              title: "Ingreso exitoso",
              description: "Has ingresado correctamente a tu cuenta.",
              type: "success",
            });
            router.push("/dashboard");
            router.refresh();
            return;
          }

          toast.add({
            title: "Límite de correos en Supabase",
            description: "Supabase ha bloqueado temporalmente el envío de correos. Lee las instrucciones en pantalla para desbloquearlo.",
            type: "warning",
          });
          return;
        }

        const isAlreadyRegistered =
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user already") ||
          error.status === 422;

        toast.add({
          title: isAlreadyRegistered
            ? "Esta cuenta ya existe"
            : "Error al registrarse",
          description: isAlreadyRegistered
            ? "Este correo electrónico ya está registrado. Inicia sesión en la pestaña 'Iniciar Sesión'."
            : error.message,
          type: "error",
        });

        if (isAlreadyRegistered) {
          setActiveTab("login");
        }
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
            "Este correo electrónico ya está registrado. Inicia sesión en la pestaña 'Iniciar Sesión'.",
          type: "warning",
        });
        setActiveTab("login");
        return;
      }

      // If user session is created immediately (Confirm email is off in Supabase)
      if (data?.session) {
        toast.add({
          title: "Cuenta creada exitosamente",
          description: "Ingresando a tu panel...",
          type: "success",
        });
        router.push("/dashboard");
        router.refresh();
        return;
      }

      toast.add({
        title: "Registro iniciado",
        description: "Revisa tu bandeja de entrada para confirmar tu correo o ingresa con tu contraseña.",
        type: "success",
      });
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
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
      {/* Fixed Top-Left Back Button */}
      <div className="fixed top-4 left-4 z-50 sm:top-6 sm:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
        >
          <ArrowLeft className="h-4 w-4" weight="bold" />
          Volver al Inicio
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10 pt-12 sm:pt-0">

        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xl ring-1 ring-primary/20">
          <Briefcase className="h-7 w-7" weight="bold" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          PostulaYa
        </h2>
        <p className="text-sm text-muted-foreground">
          Gestor Inteligente de Postulaciones Laborales
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl font-bold">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-center text-xs">
              Ingresa tus datos para acceder a tu panel de postulaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val as "login" | "register");
                setRateLimitError(false);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-xs font-semibold">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="text-xs font-semibold">
                  Registrarse
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo electrónico</Label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-9"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <a
                        href="/reset-password"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        ¿Olvidaste tu clave?
                      </a>
                    </div>
                    <PasswordInput
                      id="login-password"
                      name="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                        Ingresando...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {rateLimitError && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs space-y-2 text-amber-600 dark:text-amber-400">
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Warning className="h-4 w-4 shrink-0" />
                        Límite de correos en Supabase Auth
                      </div>
                      <p className="leading-relaxed">
                        Supabase impone un límite por hora para enviar correos de confirmación. Para solucionarlo y registrarte al instante sin esperar correo:
                      </p>
                      <div className="pt-1 border-t border-amber-500/20 space-y-1">
                        <p className="font-semibold">En tu Supabase Dashboard:</p>
                        <p className="font-mono text-[11px] bg-background/50 p-2 rounded border border-border/40">
                          Authentication ➔ Providers ➔ Email ➔ Desactivar &quot;Confirm email&quot;
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-9"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña segura</Label>
                    <PasswordInput
                      id="register-password"
                      name="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <PasswordStrengthChecker password={signUpPassword} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <PasswordInput
                      id="confirm-password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
