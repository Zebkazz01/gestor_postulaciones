"use client";

import { useState } from "react";
import { createJob, updateJob } from "@/actions/jobs";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_STATUSES, type Job } from "@/types";
import { CircleNotch, Plus, PencilSimple } from "@phosphor-icons/react";

interface JobFormDialogProps {
  job?: Job;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function JobFormDialog({
  job,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: JobFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!job;

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = isEditing
        ? await updateJob(job.id, formData)
        : await createJob(formData);

      if (!result.success) {
        toast.add({
          title: isEditing
            ? "Error al actualizar"
            : "Error al crear postulación",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: isEditing ? "Postulación actualizada" : "Postulación creada",
        description: isEditing
          ? "Los cambios se guardaron correctamente"
          : "Tu nueva postulación fue registrada",
        type: "success",
      });

      setOpen(false);
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

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" weight="bold" />
      Nueva Postulación
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          nativeButton={!trigger}
          render={(trigger ?? defaultTrigger) as React.ReactElement}
        />
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Postulación" : "Nueva Postulación"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de tu postulación"
              : "Registra una nueva postulación laboral"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa *</Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Ej: Google"
                defaultValue={job?.company_name ?? ""}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_title">Cargo *</Label>
              <Input
                id="role_title"
                name="role_title"
                placeholder="Ej: Frontend Developer"
                defaultValue={job?.role_title ?? ""}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              name="status"
              defaultValue={job?.status ?? "Pendiente"}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL de la oferta</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://..."
              defaultValue={job?.url ?? ""}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Apuntes, contacto, detalles del proceso..."
              defaultValue={job?.notes ?? ""}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                <>
                  <PencilSimple className="h-4 w-4" weight="bold" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" weight="bold" />
                  Crear Postulación
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
