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
import { CircleNotch, Trash, WarningOctagon, ArrowLeft, Siren } from "@phosphor-icons/react";

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
            render={
              <Button variant="destructive" className="w-full gap-2 font-medium">
                <Trash className="h-4 w-4" weight="bold" />
                Eliminar Mi Perfil
              </Button>
            }
          />
          <AlertDialogContent className="sm:max-w-lg w-full p-6 space-y-4">
            {step === "password" ? (
              <>
                <AlertDialogHeader className="space-y-1 text-left sm:text-left">
                  <AlertDialogTitle className="text-destructive font-bold text-lg">
                    Paso 1: Confirms tu contraseña
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground">
                    Para continuar con la eliminación de tu cuenta, ingresa tu contraseña actual para verificar tu identidad.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleProceedToWarning} className="space-y-4 pt-2">
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

                  <AlertDialogFooter className="pt-3 border-t border-border/40">
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
                <AlertDialogHeader className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive animate-bounce">
                    <Siren className="h-7 w-7" weight="bold" />
                  </div>
                  <AlertDialogTitle className="w-full text-center text-destructive text-xl font-black flex items-center justify-center gap-2">
                    <Siren className="h-6 w-6 text-destructive shrink-0" weight="bold" />
                    <span>¡ÚLTIMA ADVERTENCIA!</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="w-full text-center text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                    Estás a punto de borrar <strong className="text-destructive font-bold">definitivamente</strong> tu cuenta y todas tus postulaciones. Esta acción es <strong className="text-destructive font-bold">IRREVERSIBLE</strong> y no podrás recuperar tu información.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-semibold text-center my-1">
                  ¿Estás 100% seguro de que deseas proceder?
                </div>

                <AlertDialogFooter className="pt-3 border-t border-border/40 flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("password")}
                    disabled={isLoading}
                    className="w-full sm:w-auto gap-1 text-xs"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-xs sm:text-sm font-bold gap-2"
                  >
                    {isLoading ? (
                      <>
                        <CircleNotch className="h-4 w-4 animate-spin" />
                        Eliminando cuenta...
                      </>
                    ) : (
                      "Sí, eliminar cuenta definitivamente"
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
