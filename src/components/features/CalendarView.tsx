"use client";

import { useState } from "react";
import type { Job, JobReminder } from "@/types";
import { createReminder, deleteReminder } from "@/actions/reminders";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/features/StatusBadge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarBlank,
  Clock,
  Plus,
  Trash,
  Briefcase,
  Funnel,
  CircleNotch,
  CheckCircle,
} from "@phosphor-icons/react";

interface CalendarViewProps {
  jobs: Job[];
  reminders: JobReminder[];
}

export function CalendarView({ jobs, reminders }: CalendarViewProps) {
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter reminders by selected job
  const filteredReminders = reminders.filter((r) => {
    if (selectedJobFilter === "all") return true;
    return r.job_id === selectedJobFilter;
  });

  async function handleCreateReminder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createReminder(formData);

      if (!result.success) {
        toast.add({
          title: "Error al agendar reunión",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Reunión agendada",
        description: "Se ha creado el recordatorio para tu postulación.",
        type: "success",
      });

      setIsDialogOpen(false);
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

  async function handleDeleteReminder(id: string) {
    try {
      const result = await deleteReminder(id);
      if (!result.success) {
        toast.add({
          title: "Error al eliminar",
          description: result.error,
          type: "error",
        });
        return;
      }
      toast.add({
        title: "Recordatorio eliminado",
        description: "El evento se ha removido de tu calendario.",
        type: "info",
      });
    } catch {
      toast.add({
        title: "Error inesperado",
        description: "Inténtalo de nuevo más tarde",
        type: "error",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarBlank className="h-6 w-6 text-primary" weight="bold" />
            Calendario de Reuniones y Recordatorios
          </h2>
          <p className="text-sm text-muted-foreground">
            Agenda entrevistas, pruebas técnicas y llamadas asociadas al historial de cada vacante.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            nativeButton={false}
            render={
              <Button className="gap-2 shrink-0">
                <Plus className="h-4 w-4" weight="bold" />
                Nueva Reunión
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" weight="bold" />
                Agendar Nueva Reunión / Recordatorio
              </DialogTitle>
              <DialogDescription>
                Selecciona la postulación a la que corresponde este evento.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateReminder} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="job_id">Postulación / Vacante *</Label>
                <Select name="job_id" required disabled={isLoading || jobs.length === 0}>
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
                {jobs.length === 0 && (
                  <p className="text-xs text-amber-500">
                    Primero debes registrar al menos una postulación.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título de la reunión *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Entrevista Técnica con Líder de Ingeniería"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting_date">Fecha y Hora *</Label>
                <Input
                  id="meeting_date"
                  name="meeting_date"
                  type="datetime-local"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas o detalles del evento</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Ej: Preparar presentación del proyecto, enlace de Google Meet..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || jobs.length === 0}>
                  {isLoading ? (
                    <>
                      <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Reunión"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter by Job Timeline */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3">
        <Funnel className="h-4 w-4 text-muted-foreground ml-1" />
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          Filtrar por vacante:
        </span>
        <Select
          value={selectedJobFilter}
          onValueChange={(val) => setSelectedJobFilter(val ?? "all")}
        >
          <SelectTrigger className="h-9 w-64 text-xs">
            <SelectValue placeholder="Todas las vacantes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las vacantes</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.company_name} ({job.role_title})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reminders List & History Timeline */}
      {filteredReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <CalendarBlank className="h-7 w-7 text-muted-foreground" weight="duotone" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No hay reuniones ni recordatorios</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {selectedJobFilter === "all"
              ? "Agenda tu primera reunión para llevar el historial completo de tus entrevistas."
              : "No hay reuniones programadas para la vacante seleccionada."}
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" weight="bold" />
            Agendar Reunión
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Historial y Próximos Eventos ({filteredReminders.length})
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReminders.map((reminder) => {
              const meetingDateObj = new Date(reminder.meeting_date);
              const isPast = meetingDateObj < new Date();

              return (
                <div
                  key={reminder.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all ${
                    isPast
                      ? "border-border/40 bg-card/60 opacity-80"
                      : "border-primary/30 bg-card hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          {meetingDateObj.toLocaleDateString("es-ES", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          ·{" "}
                          {meetingDateObj.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <h4 className="font-bold text-base tracking-tight">
                          {reminder.title}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        title="Eliminar recordatorio"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>

                    {reminder.jobs && (
                      <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs">
                        <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0 flex-1 truncate font-medium">
                          {reminder.jobs.company_name} — {reminder.jobs.role_title}
                        </div>
                        <StatusBadge status={reminder.jobs.status} />
                      </div>
                    )}

                    {reminder.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/20 p-2 rounded-md italic">
                        &ldquo;{reminder.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {isPast ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          Completada
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          Programada
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
