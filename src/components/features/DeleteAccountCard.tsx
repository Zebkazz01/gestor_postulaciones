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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleNotch, Trash, WarningOctagon, ArrowLeft } from "@phosphor-icons/react";

export function DeleteAccountCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"password" | "final_warning">("password");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetModal = () => {
    setOpen(false);
    setStep("password");
    setPassword("");
  };

  async function handleDeleteAccount() {
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
        setStep("password");
        return;
      }

      toast.add({
        title: "Perfil eliminado",
        description: "Tu cuenta y tus datos han sido eliminados correctamente.",
        type: "info",
      });

      resetModal();
      router.push("/login");
      router.refresh();
    } catch {
      toast.add({
        title: "Error inesperado",
        description: "Inténtalo de nuevo más tarde",
        type: "error",
      });
      setStep("password");
    } finally {
      setIsLoading(false);
    }
  }

  function handleProceedToWarning(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setStep("final_warning");
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
        <AlertDialog open={open} onOpenChange={(val) => {
          if (!val) resetModal();
          else setOpen(true);
        }}>
          <AlertDialogTrigger
            nativeButton={false}
            render={
              <Button variant="destructive" className="w-full gap-2 font-medium">
                <Trash className="h-4 w-4" weight="bold" />
                Eliminar Mi Perfil
              </Button>
            }
          />
          <AlertDialogContent className="sm:max-w-md">
            {step === "password" ? (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">
                    Paso 1: Confirma tu contraseña
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Para continuar con la eliminación de tu cuenta, ingresa tu contraseña actual para verificar tu identidad.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleProceedToWarning} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Contraseña actual</Label>
                    <PasswordInput
                      id="delete-password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <AlertDialogFooter className="pt-2">
                    <AlertDialogCancel disabled={isLoading} onClick={resetModal}>
                      Cancelar
                    </AlertDialogCancel>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={!password || isLoading}
                    >
                      Siguiente: Confirmar
                    </Button>
                  </AlertDialogFooter>
                </form>
              </>
            ) : (
              /* Step 2: Final Warning */
              <>
                <AlertDialogHeader>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive animate-bounce">
                    <WarningOctagon className="h-7 w-7" weight="fill" />
                  </div>
                  <AlertDialogTitle className="text-center text-destructive text-xl font-extrabold">
                    🚨 ¡ÚLTIMA ADVERTENCIA!
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm text-foreground/90 pt-1 leading-relaxed">
                    Estás a punto de borrar <strong className="text-destructive">definitivamente</strong> tu cuenta y todas tus postulaciones. Esta acción es <strong className="text-destructive">IRREVERSIBLE</strong> y no podrás recuperar tu información.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium text-center my-2">
                  ¿Estás 100% seguro de que deseas proceder?
                </div>

                <AlertDialogFooter className="pt-2 flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("password")}
                    disabled={isLoading}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="gap-2 font-bold"
                  >
                    {isLoading ? (
                      <>
                        <CircleNotch className="h-4 w-4 animate-spin" />
                        Eliminando cuenta...
                      </>
                    ) : (
                      "SÍ, ELIMINAR CUENTA DEFINITIVAMENTE"
                    )}
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
