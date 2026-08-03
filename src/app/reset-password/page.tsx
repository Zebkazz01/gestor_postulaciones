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
import { Briefcase, Loader2, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.add({
        title: "Las contraseñas no coinciden",
        description: "Verifica que ambas contraseñas ingresadas sean exactamente iguales",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.add({
        title: "Contraseña muy corta",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.add({
          title: "Error al actualizar contraseña",
          description: error.message,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido restablecida con éxito. Ingresando al dashboard...",
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
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Establece tu nueva contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
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
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu nueva contraseña"
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
                  Actualizando contraseña...
                </>
              ) : (
                "Guardar Nueva Contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
