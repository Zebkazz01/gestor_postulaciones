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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  ArrowUpRight,
  DotsThree,
  PencilSimple,
  Trash,
  Table as TableIcon,
  SquaresFour,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Briefcase className="h-8 w-8 text-muted-foreground" weight="duotone" />
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

  // Pagination Math
  const totalPages = Math.ceil(jobs.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, jobs.length);
  const currentJobs = jobs.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Controls Bar: View Toggle, Items Per Page, Counter */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Record Counter */}
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{startIndex + 1}</span> a{" "}
          <span className="font-semibold text-foreground">{endIndex}</span> de{" "}
          <span className="font-semibold text-foreground">{jobs.length}</span> postulaciones
        </div>

        <div className="flex items-center gap-3">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground hidden sm:inline">Filas:</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border/50 bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("table")}
              className="gap-1 h-7 px-2 text-xs"
              title="Vista de Tabla"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tabla</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("cards")}
              className="gap-1 h-7 px-2 text-xs"
              title="Vista de Tarjetas"
            >
              <SquaresFour className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tarjetas</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
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
              {currentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {job.company_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.role_title}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={job.status} jobId={job.id} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
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
      ) : (
        /* Cards View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base tracking-tight">{job.company_name}</h4>
                    <p className="text-sm text-muted-foreground">{job.role_title}</p>
                  </div>
                  <JobActions job={job} />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={job.status} jobId={job.id} />
                </div>

                {job.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2 pt-1 bg-muted/30 p-2 rounded-md">
                    {job.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/30 text-xs text-muted-foreground">
                <span>
                  {new Date(job.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    Ver oferta <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3">
          <div className="text-xs text-muted-foreground">
            Página <span className="font-semibold text-foreground">{validCurrentPage}</span> de{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validCurrentPage === 1}
              className="h-8 gap-1 px-2.5 text-xs"
            >
              <CaretLeft className="h-3.5 w-3.5" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              className="h-8 gap-1 px-2.5 text-xs"
            >
              Siguiente
              <CaretRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
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
              <DotsThree className="h-5 w-5" weight="bold" />
              <span className="sr-only">Acciones</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <PencilSimple className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
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
