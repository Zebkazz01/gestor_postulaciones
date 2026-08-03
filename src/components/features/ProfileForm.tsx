"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, User } from "lucide-react";

interface ProfileFormProps {
  email: string;
  initialFullName: string;
  initialAvatarUrl: string;
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bandit",
];

export function ProfileForm({
  email,
  initialFullName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.add({
          title: "Imagen muy grande",
          description: "La imagen debe pesar menos de 2MB",
          type: "error",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("avatar_url", avatarUrl);

      const result = await updateProfile(formData);

      if (!result.success) {
        toast.add({
          title: "Error al actualizar perfil",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "¡Perfil actualizado!",
        description: "Tus datos personales fueron guardados con éxito.",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar preview and selection */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-muted text-muted-foreground shadow-sm">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10" />
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <Label className="text-xs text-muted-foreground">
            Subir foto o seleccionar avatar
          </Label>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Label
              htmlFor="avatar-upload"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Subir imagen
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />

            {AVATAR_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setAvatarUrl(preset)}
                className={`h-7 w-7 overflow-hidden rounded-full border-2 transition-all ${
                  avatarUrl === preset
                    ? "border-primary scale-110"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset}
                  alt={`Avatar ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico (No modificable)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted/50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre Completo</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Ej: María García"
          defaultValue={initialFullName}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">URL de Imagen de Perfil (Opcional)</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          placeholder="https://..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando cambios...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Guardar Cambios de Perfil
          </>
        )}
      </Button>
    </form>
  );
}
