"use client";

import { useState } from "react";
import { updatePasswordFromProfile } from "@/actions/profile";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleNotch, Key } from "@phosphor-icons/react";
import {
  PasswordStrengthChecker,
  isPasswordStrong,
} from "@/components/features/PasswordStrengthChecker";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const confirmPassword = formData.get("confirm_password") as string;

      if (newPassword !== confirmPassword) {
        toast.add({
          title: "Las contraseñas no coinciden",
          description: "Verifica que ambas contraseñas ingresadas sean exactamente iguales.",
          type: "error",
        });
        return;
      }

      if (!isPasswordStrong(newPassword)) {
        toast.add({
          title: "Contraseña poco segura",
          description: "Por favor asegúrate de cumplir con todos los requisitos de seguridad indicados.",
          type: "warning",
        });
        return;
      }

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

      setNewPassword("");
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
          placeholder="Contraseña segura"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={8}
          autoComplete="new-password"
        />
        <PasswordStrengthChecker password={newPassword} />
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
          minLength={8}
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
