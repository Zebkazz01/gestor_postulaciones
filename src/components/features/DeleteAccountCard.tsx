"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/profile";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleNotch, Trash, WarningOctagon } from "@phosphor-icons/react";

export function DeleteAccountCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);

    try {
      const result = await deleteAccount(password);

      if (!result.success) {
        toast.add({
          title: "Error al eliminar perfil",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Perfil eliminado",
        description: "Tu cuenta y tus datos han sido eliminados correctamente.",
        type: "info",
      });

      setOpen(false);
      router.push("/login");
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
    <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <WarningOctagon className="h-5 w-5" weight="bold" />
          </div>
          <div>
            <CardTitle className="text-xl text-destructive">Zona de Peligro</CardTitle>
            <CardDescription>
              Elimina permanentemente tu cuenta y todas tus postulaciones
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            nativeButton={false}
            render={
              <Button variant="destructive" className="w-full gap-2 font-medium">
                <Trash className="h-4 w-4" weight="bold" />
                Eliminar Mi Perfil
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">
                ¿Estás completamente seguro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará tu cuenta y todas tus postulaciones registradas. Para confirmar, ingresa tu contraseña actual.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleDeleteAccount} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="delete-password">Confirma tu Contraseña</Label>
                <PasswordInput
                  id="delete-password"
                  placeholder="Ingresa tu contraseña actual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <AlertDialogFooter className="pt-2">
                <AlertDialogCancel disabled={isLoading} onClick={() => setPassword("")}>
                  Cancelar
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading || !password}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircleNotch className="h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Sí, eliminar cuenta"
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
