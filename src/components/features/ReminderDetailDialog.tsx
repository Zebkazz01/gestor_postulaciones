"use client";

import { useState } from "react";
import type { Job, JobReminder } from "@/types";
import { updateReminder, deleteReminder } from "@/actions/reminders";
import { toast } from "@/components/ui/toast";
import { StatusBadge } from "@/components/features/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Briefcase,
  PencilSimple,
  Trash,
  X,
  CircleNotch,
  CheckCircle,
  CalendarBlank,
} from "@phosphor-icons/react";

interface ReminderDetailDialogProps {
  reminder: JobReminder | null;
  jobs: Job[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReminderDetailDialog({
  reminder,
  jobs,
  open,
  onOpenChange,
}: ReminderDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!reminder) return null;

  const meetingDateObj = new Date(reminder.meeting_date);
  const isPast = meetingDateObj < new Date();

  // Prefilled date-time string for datetime-local
  const prefilledDate = new Date(
    meetingDateObj.getTime() - meetingDateObj.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reminder) return;
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateReminder(reminder.id, formData);

      if (!result.success) {
        toast.add({
          title: "Error al actualizar",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Reunión actualizada",
        description: "Se ha modificado la fecha o detalles de la reunión.",
        type: "success",
      });

      setIsEditing(false);
      onOpenChange(false);
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

  async function handleDelete() {
    if (!reminder) return;
    setIsLoading(true);

    try {
      const result = await deleteReminder(reminder.id);
      if (!result.success) {
        toast.add({
          title: "Error al eliminar",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Reunión eliminada",
        description: "El evento se ha removido del calendario.",
        type: "info",
      });

      onOpenChange(false);
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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setIsEditing(false);
        onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="pr-6 border-b border-border/40 pb-4">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" weight="bold" />
              </div>
              <span>{isEditing ? "Modificar / Mover Fecha" : "Detalles de la Reunión"}</span>
            </DialogTitle>
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                isPast
                  ? "bg-muted text-muted-foreground"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {isPast ? "Completada" : "Programada"}
            </span>
          </div>
        </DialogHeader>

        {!isEditing ? (
          /* Details View */
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <h3 className="font-bold text-lg leading-tight">{reminder.title}</h3>

              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <CalendarBlank className="h-4 w-4" />
                {meetingDateObj.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                ·{" "}
                {meetingDateObj.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {reminder.jobs && (
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">{reminder.jobs.company_name}</p>
                    <p className="text-muted-foreground">{reminder.jobs.role_title}</p>
                  </div>
                </div>
                <StatusBadge status={reminder.jobs.status} />
              </div>
            )}

            {reminder.notes ? (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Notas / Enlaces:</span>
                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl italic">
                  &ldquo;{reminder.notes}&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60 italic">Sin notas adicionales.</p>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5 text-xs"
              >
                <PencilSimple className="h-4 w-4 text-primary" />
                Modificar / Mover Fecha
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-1 text-xs"
                >
                  <Trash className="h-4 w-4" />
                  Eliminar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-xs"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Edit / Move Date Form View */
          <form onSubmit={handleUpdate} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="job_id">Postulación / Vacante *</Label>
              <Select name="job_id" defaultValue={reminder.job_id} required disabled={isLoading}>
                <SelectTrigger id="job_id">
                  <SelectValue placeholder="Selecciona una vacante" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.company_name} — {job.role_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título de la reunión *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={reminder.title}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_date">Fecha y Hora * (Mover reunión)</Label>
              <Input
                id="meeting_date"
                name="meeting_date"
                type="datetime-local"
                defaultValue={prefilledDate}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas o detalles</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={reminder.notes || ""}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
