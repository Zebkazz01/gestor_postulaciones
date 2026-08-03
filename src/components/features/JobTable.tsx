"use client";

import { useState } from "react";
import type { Job, JobReminder } from "@/types";
import { JOB_STATUSES } from "@/types";
import { StatusBadge } from "@/components/features/StatusBadge";
import { JobFormDialog } from "@/components/features/JobFormDialog";
import { DeleteJobDialog } from "@/components/features/DeleteJobDialog";
import { JobTraceabilityDialog } from "@/components/features/JobTraceabilityDialog";
import { GlobalTraceabilityDialog } from "@/components/features/GlobalTraceabilityDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MagnifyingGlass,
  Funnel,
  X,
  MapPin,
  EnvelopeSimple,
  PhoneCall,
  ClockCounterClockwise,
} from "@phosphor-icons/react";

interface JobTableProps {
  jobs: Job[];
  reminders?: JobReminder[];
}

export function JobTable({ jobs, reminders = [] }: JobTableProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  // Filtering Math
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      job.company_name.toLowerCase().includes(query) ||
      job.role_title.toLowerCase().includes(query) ||
      (job.notes && job.notes.toLowerCase().includes(query)) ||
      (job.location && job.location.toLowerCase().includes(query)) ||
      (job.contact_email && job.contact_email.toLowerCase().includes(query)) ||
      (job.contact_phone && job.contact_phone.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa, cargo, ubicación, correo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Global Traceability Modal Button */}
          <GlobalTraceabilityDialog jobs={jobs} reminders={reminders} />

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 min-w-[140px]">
            <Funnel className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val ?? "all");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {JOB_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}

          {/* Rows Per Page */}
          <div className="flex items-center gap-1 text-xs">
            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => {
                setItemsPerPage(Number(val ?? 10));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-16 text-xs">
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
              className="gap-1 h-8 px-2 text-xs"
              title="Vista de Tabla"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Tabla</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("cards")}
              className="gap-1 h-8 px-2 text-xs"
              title="Vista de Tarjetas"
            >
              <SquaresFour className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Tarjetas</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Record Counter Info Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          {filteredJobs.length === 0 ? (
            "No hay resultados"
          ) : (
            <>
              Mostrando <span className="font-semibold text-foreground">{startIndex + 1}</span> a{" "}
              <span className="font-semibold text-foreground">{endIndex}</span> de{" "}
              <span className="font-semibold text-foreground">{filteredJobs.length}</span>{" "}
              {hasActiveFilters ? `postulaciones (filtradas de ${jobs.length})` : "postulaciones"}
            </>
          )}
        </span>
      </div>

      {/* Empty Filter State */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center">
          <MagnifyingGlass className="mb-3 h-8 w-8 text-muted-foreground opacity-60" />
          <h4 className="font-semibold text-sm">No se encontraron postulaciones</h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No coinciden registros con los criterios de búsqueda o estado seleccionados.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4 gap-1 text-xs">
            <X className="h-3.5 w-3.5" />
            Restablecer Filtros
          </Button>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Empresa</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Contacto & Ubicación</TableHead>
                <TableHead className="hidden lg:table-cell">URL</TableHead>
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
                  <TableCell className="hidden md:table-cell text-xs space-y-1">
                    {job.location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.contact_email && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <EnvelopeSimple className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <a href={`mailto:${job.contact_email}`} className="hover:underline">
                          {job.contact_email}
                        </a>
                      </div>
                    )}
                    {job.contact_phone && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <PhoneCall className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <a href={`tel:${job.contact_phone}`} className="hover:underline">
                          {job.contact_phone}
                        </a>
                      </div>
                    )}
                    {!job.location && !job.contact_email && !job.contact_phone && (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Ver oferta
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {new Date(job.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <JobActions job={job} reminders={reminders} />
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
              className="flex flex-col justify-between rounded-xl border border-border/50 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base tracking-tight">{job.company_name}</h4>
                    <p className="text-sm text-muted-foreground">{job.role_title}</p>
                  </div>
                  <JobActions job={job} reminders={reminders} />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={job.status} jobId={job.id} />
                </div>

                {/* Contact & Location Info in Card */}
                {(job.location || job.contact_email || job.contact_phone) && (
                  <div className="space-y-1 rounded-lg border border-border/40 bg-muted/20 p-2 text-xs">
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.contact_email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <EnvelopeSimple className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <a href={`mailto:${job.contact_email}`} className="hover:underline">
                          {job.contact_email}
                        </a>
                      </div>
                    )}
                    {job.contact_phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <PhoneCall className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <a href={`tel:${job.contact_phone}`} className="hover:underline">
                          {job.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}

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

function JobActions({ job, reminders = [] }: { job: Job; reminders?: JobReminder[] }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTraceabilityDialog, setShowTraceabilityDialog] = useState(false);

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
          <DropdownMenuItem onClick={() => setShowTraceabilityDialog(true)}>
            <ClockCounterClockwise className="mr-2 h-4 w-4 text-primary" />
            Ver Trazabilidad
          </DropdownMenuItem>
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

      <JobTraceabilityDialog
        job={job}
        reminders={reminders}
        open={showTraceabilityDialog}
        onOpenChange={setShowTraceabilityDialog}
      />

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
