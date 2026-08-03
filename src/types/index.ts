export interface Job {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  status: JobStatus;
  url: string | null;
  notes: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  location?: string | null;
  created_at: string;
}

export type JobStatus =
  | "Pendiente"
  | "Entrevista"
  | "Prueba Técnica"
  | "Oferta"
  | "Rechazado";

export const JOB_STATUSES: JobStatus[] = [
  "Pendiente",
  "Entrevista",
  "Prueba Técnica",
  "Oferta",
  "Rechazado",
];

export interface JobFormData {
  company_name: string;
  role_title: string;
  status: JobStatus;
  url?: string;
  notes?: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
}

export interface JobReminder {
  id: string;
  user_id: string;
  job_id: string;
  title: string;
  meeting_date: string;
  notes?: string | null;
  created_at: string;
  // Relación opcional cargada desde jobs
  jobs?: {
    company_name: string;
    role_title: string;
    status: JobStatus;
  } | null;
}
