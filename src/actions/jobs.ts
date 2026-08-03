"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Job, JobStatus } from "@/types";

const jobSchema = z.object({
  company_name: z.string().min(1, "El nombre de la empresa es requerido"),
  role_title: z.string().min(1, "El cargo es requerido"),
  status: z.enum([
    "Pendiente",
    "Entrevista",
    "Prueba Técnica",
    "Oferta",
    "Rechazado",
  ]) as z.ZodType<JobStatus>,
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  contact_email: z.string().email("Correo de contacto inválido").optional().or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
});

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error.message);
    return [];
  }

  return (data as Job[]) ?? [];
}

export async function createJob(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const rawData = {
      company_name: formData.get("company_name") as string,
      role_title: formData.get("role_title") as string,
      status: (formData.get("status") as string) || "Pendiente",
      url: formData.get("url") as string,
      notes: formData.get("notes") as string,
      contact_email: formData.get("contact_email") as string,
      contact_phone: formData.get("contact_phone") as string,
      location: formData.get("location") as string,
    };

    const parsed = jobSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return { success: false, error: firstError };
    }

    // Base payload with standard columns
    const basePayload: Record<string, any> = {
      user_id: user.id,
      company_name: parsed.data.company_name,
      role_title: parsed.data.role_title,
      status: parsed.data.status,
      url: parsed.data.url || null,
      notes: parsed.data.notes || null,
    };

    // Extended payload with new optional contact columns
    const fullPayload = { ...basePayload };
    if (parsed.data.contact_email) fullPayload.contact_email = parsed.data.contact_email;
    if (parsed.data.contact_phone) fullPayload.contact_phone = parsed.data.contact_phone;
    if (parsed.data.location) fullPayload.location = parsed.data.location;

    let { error } = await supabase.from("jobs").insert(fullPayload);

    // Fallback retry without optional contact columns if remote Supabase schema cache has not been reloaded yet
    if (error && (error.message.includes("schema cache") || error.message.includes("contact_email") || error.message.includes("column"))) {
      const retryResult = await supabase.from("jobs").insert(basePayload);
      error = retryResult.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear la postulación" };
  }
}

export async function updateJob(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const rawData = {
      company_name: formData.get("company_name") as string,
      role_title: formData.get("role_title") as string,
      status: (formData.get("status") as string) || "Pendiente",
      url: formData.get("url") as string,
      notes: formData.get("notes") as string,
      contact_email: formData.get("contact_email") as string,
      contact_phone: formData.get("contact_phone") as string,
      location: formData.get("location") as string,
    };

    const parsed = jobSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return { success: false, error: firstError };
    }

    const basePayload: Record<string, any> = {
      company_name: parsed.data.company_name,
      role_title: parsed.data.role_title,
      status: parsed.data.status,
      url: parsed.data.url || null,
      notes: parsed.data.notes || null,
    };

    const fullPayload = { ...basePayload };
    if (parsed.data.contact_email !== undefined) fullPayload.contact_email = parsed.data.contact_email || null;
    if (parsed.data.contact_phone !== undefined) fullPayload.contact_phone = parsed.data.contact_phone || null;
    if (parsed.data.location !== undefined) fullPayload.location = parsed.data.location || null;

    let { error } = await supabase
      .from("jobs")
      .update(fullPayload)
      .eq("id", id)
      .eq("user_id", user.id);

    // Fallback retry without optional contact columns if remote Supabase schema cache has not been reloaded yet
    if (error && (error.message.includes("schema cache") || error.message.includes("contact_email") || error.message.includes("column"))) {
      const retryResult = await supabase
        .from("jobs")
        .update(basePayload)
        .eq("id", id)
        .eq("user_id", user.id);
      error = retryResult.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al actualizar la postulación",
    };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al eliminar la postulación",
    };
  }
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const { error } = await supabase
      .from("jobs")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al actualizar el estado",
    };
  }
}
