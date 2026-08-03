"use client";

import { useState } from "react";
import type { Job } from "@/types";
import { StatusBadge } from "@/components/features/StatusBadge";
import { JobFormDialog } from "@/components/features/JobFormDialog";
import { DeleteJobDialog } from "@/components/features/DeleteJobDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">
          Aún no tienes postulaciones
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Comienza registrando tu primera postulación laboral para llevar un
          seguimiento organizado.
        </p>
        <JobFormDialog />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      {/* Mobile view: Cards */}
      <div className="block sm:hidden">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start justify-between border-b border-border/50 p-4 last:border-b-0"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-medium">{job.company_name}</p>
              <p className="text-sm text-muted-foreground">{job.role_title}</p>
              <div className="flex items-center gap-2 pt-1">
                <StatusBadge status={job.status} />
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
            <JobActions job={job} />
          </div>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Empresa</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha</TableHead>
              <TableHead className="w-12 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  {job.company_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.role_title}
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver oferta
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                  {new Date(job.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <JobActions job={job} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function JobActions({ job }: { job: Job }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Acciones</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <JobFormDialog
        job={job}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteJobDialog
        jobId={job.id}
        companyName={job.company_name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
