"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { JOB_STATUSES, type JobStatus } from "@/types";
import { updateJobStatus } from "@/actions/jobs";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretDown, CircleNotch } from "@phosphor-icons/react";

const statusConfig: Record<
  JobStatus,
  { label: string; className: string; toastType: "info" | "success" | "warning" | "error" }
> = {
  Pendiente: {
    label: "Pendiente",
    className:
      "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
    toastType: "warning",
  },
  Entrevista: {
    label: "Entrevista",
    className:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
    toastType: "info",
  },
  "Prueba Técnica": {
    label: "Prueba Técnica",
    className:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
    toastType: "info",
  },
  Oferta: {
    label: "Oferta",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25",
    toastType: "success",
  },
  Rechazado: {
    label: "Rechazado",
    className:
      "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/25",
    toastType: "error",
  },
};

interface StatusBadgeProps {
  status: JobStatus;
  jobId?: string;
}

export function StatusBadge({ status, jobId }: StatusBadgeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = statusConfig[status] ?? statusConfig.Pendiente;

  if (!jobId) {
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  }

  async function handleStatusChange(newStatus: JobStatus) {
    if (newStatus === status || !jobId) return;
    setIsLoading(true);

    try {
      const result = await updateJobStatus(jobId, newStatus);

      if (!result.success) {
        toast.add({
          title: "Error al actualizar estado",
          description: result.error,
          type: "error",
        });
        return;
      }

      const targetConfig = statusConfig[newStatus];
      toast.add({
        title: `Estado cambiado a: ${newStatus}`,
        description: "El estado de la postulación ha sido actualizado.",
        type: targetConfig.toastType,
      });
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
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Badge
            variant="outline"
            className={`cursor-pointer transition-all gap-1 select-none py-0.5 ${config.className}`}
          >
            {isLoading ? (
              <CircleNotch className="h-3 w-3 animate-spin" />
            ) : (
              <>
                {config.label}
                <CaretDown className="h-3 w-3 opacity-70" />
              </>
            )}
          </Badge>
        }
      />
      <DropdownMenuContent align="start" className="w-40">
        {JOB_STATUSES.map((itemStatus) => (
          <DropdownMenuItem
            key={itemStatus}
            onClick={() => handleStatusChange(itemStatus)}
            className={`cursor-pointer text-xs ${
              itemStatus === status ? "font-bold bg-muted" : ""
            }`}
          >
            {itemStatus}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
