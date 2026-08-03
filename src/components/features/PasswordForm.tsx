"use client";

import { useState } from "react";
import { updatePasswordFromProfile } from "@/actions/profile";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleNotch, Key } from "@phosphor-icons/react";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updatePasswordFromProfile(formData);

      if (!result.success) {
        toast.add({
          title: "Error al actualizar contraseña",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada correctamente.",
        type: "success",
      });

      e.currentTarget.reset();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new_password">Nueva Contraseña</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          required
          disabled={isLoading}
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar Nueva Contraseña</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Repite la nueva contraseña"
          required
          disabled={isLoading}
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2">
        {isLoading ? (
          <>
            <CircleNotch className="h-4 w-4 animate-spin" />
            Actualizando...
          </>
        ) : (
          <>
            <Key className="h-4 w-4" weight="bold" />
            Actualizar Contraseña
          </>
        )}
      </Button>
    </form>
  );
}
