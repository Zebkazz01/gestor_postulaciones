"use client";

import type { Job, JobReminder } from "@/types";
import { StatusBadge } from "@/components/features/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Clock,
  MapPin,
  EnvelopeSimple,
  PhoneCall,
  ArrowUpRight,
  CalendarBlank,
  CheckCircle,
} from "@phosphor-icons/react";

interface JobTraceabilityDialogProps {
  job: Job;
  reminders: JobReminder[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobTraceabilityDialog({
  job,
  reminders,
  open,
  onOpenChange,
}: JobTraceabilityDialogProps) {
  // Filter meetings for this specific job
  const jobReminders = reminders
    .filter((r) => r.job_id === job.id)
    .sort(
      (a, b) =>
        new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime()
    );

  const createdDate = new Date(job.created_at).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="pr-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" weight="bold" />
                </div>
                <span>{job.company_name}</span>
              </DialogTitle>
              <DialogDescription className="text-sm font-semibold text-foreground/90 pl-1">
                {job.role_title}
              </DialogDescription>
            </div>
            <StatusBadge status={job.status} jobId={job.id} />
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Metadata Summary Card */}
          <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/30 pb-2">
              <span className="font-medium">Fecha de registro:</span>
              <span className="font-semibold text-foreground capitalize">{createdDate}</span>
            </div>

            {(job.location || job.contact_email || job.contact_phone) && (
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                {job.location && (
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground truncate">{job.location}</span>
                  </div>
                )}
                {job.contact_email && (
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 p-2 rounded-lg">
                    <EnvelopeSimple className="h-4 w-4 text-blue-400 shrink-0" />
                    <a href={`mailto:${job.contact_email}`} className="text-blue-500 hover:underline truncate">
                      {job.contact_email}
                    </a>
                  </div>
                )}
                {job.contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 p-2 rounded-lg">
                    <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0" />
                    <a href={`tel:${job.contact_phone}`} className="text-emerald-500 hover:underline truncate">
                      {job.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {job.url && (
              <div className="pt-1">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Ver publicación de la oferta
                </a>
              </div>
            )}

            {job.notes && (
              <div className="pt-2 border-t border-border/30">
                <span className="text-xs font-semibold text-muted-foreground block mb-1">Notas:</span>
                <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-xl">
                  &ldquo;{job.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Timeline of Meetings & History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                Historial de Entrevistas y Reuniones ({jobReminders.length})
              </h4>
            </div>

            {jobReminders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                <CalendarBlank className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                No hay reuniones ni entrevistas programadas para esta vacante aún.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/30">
                {jobReminders.map((reminder) => {
                  const mDate = new Date(reminder.meeting_date);
                  const isPast = mDate < new Date();

                  return (
                    <div key={reminder.id} className="relative group">
                      {/* Node Indicator */}
                      <div
                        className={`absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                          isPast
                            ? "bg-muted border-border text-muted-foreground"
                            : "bg-primary text-primary-foreground border-primary shadow-xs animate-pulse"
                        }`}
                      >
                        {isPast ? (
                          <CheckCircle className="h-3 w-3" weight="bold" />
                        ) : (
                          <Clock className="h-3 w-3" weight="bold" />
                        )}
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {mDate.toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            ·{" "}
                            {mDate.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isPast
                                ? "bg-muted text-muted-foreground"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {isPast ? "Completada" : "Programada"}
                          </span>
                        </div>

                        <h5 className="font-bold text-sm text-foreground">{reminder.title}</h5>

                        {reminder.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl italic">
                            &ldquo;{reminder.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
