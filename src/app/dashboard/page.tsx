import { getJobs } from "@/actions/jobs";
import { JobTable } from "@/components/features/JobTable";
import { JobFormDialog } from "@/components/features/JobFormDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JobStatus } from "@/types";
import {
  Clock,
  ChatTeardropText,
  Code,
  Trophy,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";

const statCards: {
  status: JobStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    status: "Pendiente",
    label: "Pendientes",
    icon: Clock,
    color: "text-yellow-400",
  },
  {
    status: "Entrevista",
    label: "Entrevistas",
    icon: ChatTeardropText,
    color: "text-blue-400",
  },
  {
    status: "Prueba Técnica",
    label: "Pruebas Técnicas",
    icon: Code,
    color: "text-purple-400",
  },
  {
    status: "Oferta",
    label: "Ofertas",
    icon: Trophy,
    color: "text-green-400",
  },
  {
    status: "Rechazado",
    label: "Rechazados",
    icon: XCircle,
    color: "text-red-400",
  },
];

export default async function DashboardPage() {
  const jobs = await getJobs();

  const counts = statCards.map((card) => ({
    ...card,
    count: jobs.filter((j) => j.status === card.status).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map(({ status, label, icon: Icon, color, count }) => (
          <Card
            key={status}
            className="border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`${color}`}>
                <Icon className="h-5 w-5" weight="duotone" />
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-8" />

      {/* Header + Create Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mis Postulaciones
          </h1>
          <p className="text-sm text-muted-foreground">
            {jobs.length === 0
              ? "Registra tu primera postulación"
              : `${jobs.length} postulación${jobs.length !== 1 ? "es" : ""} registrada${jobs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {jobs.length > 0 && <JobFormDialog />}
      </div>

      {/* Table */}
      <JobTable jobs={jobs} />
    </div>
  );
}
