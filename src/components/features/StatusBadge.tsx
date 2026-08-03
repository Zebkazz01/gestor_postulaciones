import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types";

const statusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  Pendiente: {
    label: "Pendiente",
    className:
      "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
  },
  Entrevista: {
    label: "Entrevista",
    className:
      "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
  },
  "Prueba Técnica": {
    label: "Prueba Técnica",
    className:
      "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
  },
  Oferta: {
    label: "Oferta",
    className:
      "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25",
  },
  Rechazado: {
    label: "Rechazado",
    className:
      "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25",
  },
};

interface StatusBadgeProps {
  status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Pendiente;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
