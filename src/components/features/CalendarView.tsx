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
  CaretLeft,
  CaretRight,
  CalendarCheck,
  ListNumbers,
  Rows,
} from "@phosphor-icons/react";

interface CalendarViewProps {
  jobs: Job[];
  reminders: JobReminder[];
}

type CalendarMode = "mes" | "semana" | "dia" | "bandeja";

export function CalendarView({ jobs, reminders }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarMode>("mes");
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string>("");

  // Filter reminders by selected job
  const filteredReminders = reminders.filter((r) => {
    if (selectedJobFilter === "all") return true;
    return r.job_id === selectedJobFilter;
  });

  // Calendar Navigation Helpers
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mes") newDate.setMonth(newDate.getMonth() - 1);
    else if (viewMode === "semana") newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mes") newDate.setMonth(newDate.getMonth() + 1);
    else if (viewMode === "semana") newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleOpenDialogForDate = (date: Date) => {
    setSelectedDate(date);
    const isoString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setPrefilledDate(isoString);
    setIsDialogOpen(true);
  };

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

  // Month Days Matrix Generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  // Empty cells before month start
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  // Helpers to match date string YYYY-MM-DD
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getRemindersForDay = (dayDate: Date) =>
    filteredReminders.filter((r) => isSameDay(new Date(r.meeting_date), dayDate));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarBlank className="h-6 w-6 text-primary" weight="bold" />
            Calendario de Reuniones
          </h2>
          <p className="text-sm text-muted-foreground">
            Planifica entrevistas, pruebas técnicas y llamadas por fecha y hora.
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
                Asocia esta reunión a una postulación para mantener tu historial.
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
                    Debes tener al menos una postulación creada para agendar reuniones.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título de la reunión *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Entrevista Técnica con Lead Frontend"
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
                  defaultValue={prefilledDate}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas de la reunión</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Detalles, preguntas clave o enlace de reunión..."
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
                      Agendando...
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

      {/* Controls Bar: Navigation, View Switcher & Job Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/50 bg-card p-3">
        {/* Month & Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev} className="h-8 w-8">
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday} className="h-8 px-2.5 text-xs font-semibold">
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext} className="h-8 w-8">
            <CaretRight className="h-4 w-4" />
          </Button>

          <span className="ml-2 font-bold text-sm capitalize">
            {monthName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Job Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Funnel className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
            <Select
              value={selectedJobFilter}
              onValueChange={(val) => setSelectedJobFilter(val ?? "all")}
            >
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Todas las vacantes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las vacantes</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Modes Switcher: Mes, Semana, Día, Bandeja */}
          <div className="flex items-center rounded-lg border border-border/50 bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "mes" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("mes")}
              className="h-7 px-2.5 text-xs font-semibold"
            >
              Mes
            </Button>
            <Button
              variant={viewMode === "semana" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("semana")}
              className="h-7 px-2.5 text-xs font-semibold"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "dia" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("dia")}
              className="h-7 px-2.5 text-xs font-semibold"
            >
              Día
            </Button>
            <Button
              variant={viewMode === "bandeja" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("bandeja")}
              className="h-7 px-2.5 text-xs font-semibold gap-1"
            >
              <Rows className="h-3.5 w-3.5" />
              Bandeja
            </Button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "mes" && (
        /* Month Grid View */
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-xs">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30 text-center text-xs font-bold text-muted-foreground py-2.5">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border/30">
            {calendarCells.map((dayDate, index) => {
              if (!dayDate) {
                return <div key={`empty-${index}`} className="min-h-[100px] bg-muted/10" />;
              }

              const dayReminders = getRemindersForDay(dayDate);
              const isToday = isSameDay(dayDate, new Date());
              const isSelected = isSameDay(dayDate, selectedDate);

              return (
                <div
                  key={dayDate.toISOString()}
                  onClick={() => setSelectedDate(dayDate)}
                  className={`min-h-[110px] p-2 transition-colors cursor-pointer group flex flex-col justify-between ${
                    isSelected ? "bg-primary/5" : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-foreground group-hover:bg-muted"
                      }`}
                    >
                      {dayDate.getDate()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialogForDate(dayDate);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/10 p-1 rounded-md transition-all"
                      title="Agendar reunión en este día"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Day Reminders Badges */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[80px]">
                    {dayReminders.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-md bg-primary/15 border border-primary/25 px-1.5 py-0.5 text-[11px] font-semibold text-primary truncate"
                        title={`${r.title} (${new Date(r.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`}
                      >
                        {new Date(r.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {r.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "semana" && (
        /* Week View */
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
            Reuniones de la Semana
          </h3>
          <div className="grid gap-3 sm:grid-cols-7">
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
              const weekDay = new Date(currentDate);
              const dayOfWeek = (weekDay.getDay() + 6) % 7;
              weekDay.setDate(weekDay.getDate() - dayOfWeek + offset);

              const dayReminders = getRemindersForDay(weekDay);
              const isToday = isSameDay(weekDay, new Date());

              return (
                <div
                  key={offset}
                  className={`rounded-xl border p-3 min-h-[180px] flex flex-col justify-between ${
                    isToday ? "border-primary bg-primary/5" : "border-border/50 bg-muted/10"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        {weekDay.toLocaleDateString("es-ES", { weekday: "short" })}
                      </span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isToday ? "bg-primary text-primary-foreground" : ""}`}>
                        {weekDay.getDate()}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {dayReminders.map((r) => (
                        <div key={r.id} className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                          <p className="font-bold text-primary truncate">{r.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(r.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleOpenDialogForDate(weekDay)}
                    className="w-full text-[11px] gap-1 mt-2 text-primary"
                  >
                    <Plus className="h-3 w-3" /> Agendar
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "dia" && (
        /* Day View */
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h3 className="text-lg font-bold">
                {currentDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </h3>
              <p className="text-xs text-muted-foreground">Reuniones agendadas para esta fecha</p>
            </div>
            <Button size="sm" onClick={() => handleOpenDialogForDate(currentDate)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Agregar evento hoy
            </Button>
          </div>

          <div className="space-y-3">
            {getRemindersForDay(currentDate).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No tienes reuniones programadas para el {currentDate.toLocaleDateString("es-ES")}.
              </div>
            ) : (
              getRemindersForDay(currentDate).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary">
                      {new Date(r.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <h4 className="font-bold text-base">{r.title}</h4>
                    {r.jobs && (
                      <p className="text-xs text-muted-foreground">
                        {r.jobs.company_name} — {r.jobs.role_title}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(r.id)} className="text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === "bandeja" && (
        /* Agenda / Inbox View */
        <div className="space-y-4">
          {filteredReminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
              <CalendarBlank className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="font-bold text-base">Bandeja de reuniones vacía</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                No hay eventos agendados en la bandeja para los criterios seleccionados.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
