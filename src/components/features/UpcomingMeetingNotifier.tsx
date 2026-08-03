"use client";

import { useEffect, useState } from "react";
import type { JobReminder } from "@/types";
import { toast } from "@/components/ui/toast";
import { BellRinging, Clock, Briefcase } from "@phosphor-icons/react";

interface UpcomingMeetingNotifierProps {
  reminders: JobReminder[];
}

export function UpcomingMeetingNotifier({
  reminders,
}: UpcomingMeetingNotifierProps) {
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
  const [urgentReminders, setUrgentReminders] = useState<JobReminder[]>([]);

  useEffect(() => {
    function checkUpcomingMeetings() {
      const now = new Date();
      const urgent: JobReminder[] = [];

      reminders.forEach((reminder) => {
        const meetingDate = new Date(reminder.meeting_date);
        const diffMs = meetingDate.getTime() - now.getTime();
        const diffMins = diffMs / (1000 * 60);

        // Active meeting starting within 0 and 15 minutes
        if (diffMins > 0 && diffMins <= 15) {
          urgent.push(reminder);

          if (!notifiedIds.has(reminder.id)) {
            setNotifiedIds((prev) => new Set(prev).add(reminder.id));

            const formattedTime = meetingDate.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });

            toast.add({
              title: `¡Reunión próxima! (En menos de 15 min)`,
              description: `"${reminder.title}" con ${reminder.jobs?.company_name || "la empresa"} a las ${formattedTime}.`,
              type: "warning",
            });
          }
        }
      });

      setUrgentReminders(urgent);
    }

    checkUpcomingMeetings();
    const interval = setInterval(checkUpcomingMeetings, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [reminders, notifiedIds]);

  if (urgentReminders.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 shadow-sm backdrop-blur-xs animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-md">
          <BellRinging className="h-5 w-5" weight="bold" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
            Recordatorio de Reunión Próxima (en menos de 15 minutos)
          </h4>
          {urgentReminders.map((r) => (
            <div key={r.id} className="text-xs text-foreground font-semibold flex items-center gap-2 pt-0.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>{new Date(r.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <span>—</span>
              <span>{r.title}</span>
              {r.jobs && <span className="text-muted-foreground">({r.jobs.company_name})</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
