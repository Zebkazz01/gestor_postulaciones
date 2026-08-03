"use client";

import { useState } from "react";
import type { Job, JobReminder } from "@/types";
import { StatusBadge } from "@/components/features/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClockCounterClockwise,
  Briefcase,
  Clock,
  CalendarBlank,
} from "@phosphor-icons/react";

interface GlobalTraceabilityDialogProps {
  jobs: Job[];
  reminders: JobReminder[];
}

interface TimelineEvent {
  id: string;
  type: "job_created" | "meeting";
  date: Date;
  companyName: string;
  roleTitle: string;
  status?: Job["status"];
  title?: string;
  notes?: string | null;
}

export function GlobalTraceabilityDialog({
  jobs,
  reminders,
}: GlobalTraceabilityDialogProps) {
  const [open, setOpen] = useState(false);

  // Build unified events array
  const events: TimelineEvent[] = [];

  // Add Job Creations
  jobs.forEach((job) => {
    events.push({
      id: `job-${job.id}`,
      type: "job_created",
      date: new Date(job.created_at),
      companyName: job.company_name,
      roleTitle: job.role_title,
      status: job.status,
      notes: job.notes,
    });
  });

  // Add Meetings
  reminders.forEach((reminder) => {
    events.push({
      id: `rem-${reminder.id}`,
      type: "meeting",
      date: new Date(reminder.meeting_date),
      companyName: reminder.jobs?.company_name ?? "Empresa",
      roleTitle: reminder.jobs?.role_title ?? "Vacante",
      status: reminder.jobs?.status,
      title: reminder.title,
      notes: reminder.notes,
    });
  });

  // Sort chronologically descending (newest first)
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        nativeButton={false}
        render={
          <Button variant="outline" className="gap-2 text-xs font-semibold shadow-2xs h-9">
            <ClockCounterClockwise className="h-4 w-4 text-primary" weight="bold" />
            <span className="hidden sm:inline">Trazabilidad General</span>
            <span className="sm:hidden">Trazabilidad</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="pr-6 border-b border-border/40 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClockCounterClockwise className="h-5 w-5" weight="bold" />
            </div>
            <span>Trazabilidad General de Postulaciones</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Historial de actividad cronológica que unifica la creación de postulaciones y reuniones agendadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center text-xs text-muted-foreground">
              No hay actividades o reuniones registradas todavía.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/30">
              {events.map((ev) => (
                <div key={ev.id} className="relative group">
                  {/* Timeline Node Icon Badge */}
                  <div
                    className={`absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold shadow-2xs ${
                      ev.type === "job_created"
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-emerald-500 text-white border-emerald-600"
                    }`}
                    title={ev.type === "job_created" ? "Postulación Registrada" : "Reunión Agendada"}
                  >
                    {ev.type === "job_created" ? (
                      <Briefcase className="h-3 w-3" weight="bold" />
                    ) : (
                      <CalendarBlank className="h-3 w-3" weight="bold" />
                    )}
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-2 shadow-2xs hover:border-primary/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {ev.date.toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        ·{" "}
                        {ev.date.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {ev.status && <StatusBadge status={ev.status} />}
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        {ev.type === "job_created" ? "Postulación Registrada" : `Reunión: ${ev.title}`}
                      </span>
                      <h4 className="font-bold text-base text-foreground mt-0.5">
                        {ev.companyName} — <span className="text-muted-foreground font-normal">{ev.roleTitle}</span>
                      </h4>
                    </div>

                    {ev.notes && (
                      <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl italic">
                        &ldquo;{ev.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
