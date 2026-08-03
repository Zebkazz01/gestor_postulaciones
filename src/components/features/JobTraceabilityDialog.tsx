"use client";

import type { Job, JobReminder } from "@/types";
import { StatusBadge } from "@/components/features/StatusBadge";
import { Button } from "@/components/ui/button";
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
  CheckCircle,
  CalendarBlank,
  Sparkle,
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
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pt-2">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" weight="bold" />
                {job.company_name}
              </DialogTitle>
              <DialogDescription className="text-sm font-semibold text-foreground/80 mt-0.5">
                {job.role_title}
              </DialogDescription>
            </div>
            <StatusBadge status={job.status} jobId={job.id} />
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Metadata Card: Location, Contact & URL */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Registrada el:</span>
              <span className="font-semibold text-foreground capitalize">{createdDate}</span>
            </div>

            {(job.location || job.contact_email || job.contact_phone) && (
              <div className="pt-2 border-t border-border/30 space-y-1.5">
                {job.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{job.location}</span>
                  </div>
                )}
                {job.contact_email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <EnvelopeSimple className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <a href={`mailto:${job.contact_email}`} className="text-blue-500 hover:underline">
                      {job.contact_email}
                    </a>
                  </div>
                )}
                {job.contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <a href={`tel:${job.contact_phone}`} className="text-emerald-500 hover:underline">
                      {job.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {job.url && (
              <div className="pt-2 border-t border-border/30">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Ver oferta publicada <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {job.notes && (
              <div className="pt-2 border-t border-border/30">
                <span className="font-semibold text-muted-foreground block mb-1">Notas iniciales:</span>
                <p className="text-muted-foreground italic bg-background/50 p-2 rounded-lg">
                  &ldquo;{job.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Timeline of Meetings & Milestones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              Línea de Tiempo y Trazabilidad de Reuniones ({jobReminders.length})
            </h4>

            {jobReminders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                <CalendarBlank className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
                No hay reuniones ni entrevistas agendadas para esta vacante todavía.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {jobReminders.map((reminder) => {
                  const mDate = new Date(reminder.meeting_date);
                  const isPast = mDate < new Date();

                  return (
                    <div key={reminder.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                          isPast
                            ? "bg-muted border-border text-muted-foreground"
                            : "bg-primary text-primary-foreground border-primary shadow-xs"
                        }`}
                      >
                        {isPast ? "✓" : "•"}
                      </div>

                      <div className="rounded-xl border border-border/50 bg-card p-3.5 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {mDate.toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                            })}{" "}
                            ·{" "}
                            {mDate.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {isPast ? "Completada" : "Programada"}
                          </span>
                        </div>

                        <h5 className="font-bold text-sm text-foreground">{reminder.title}</h5>

                        {reminder.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-md italic">
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
