"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { JobReminder } from "@/types";

export type ReminderActionResult = {
  success: boolean;
  error?: string;
};

const reminderSchema = z.object({
  job_id: z.string().min(1, "Debes seleccionar una postulación"),
  title: z.string().min(1, "El título de la reunión es obligatorio"),
  meeting_date: z.string().min(1, "La fecha y hora son obligatorias"),
  notes: z.string().optional().or(z.literal("")),
});

export async function getReminders(): Promise<JobReminder[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("job_reminders")
      .select(`
        *,
        jobs (
          company_name,
          role_title,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("meeting_date", { ascending: true });

    if (error) {
      console.error("Error fetching reminders:", error.message);
      return [];
    }

    return (data as unknown as JobReminder[]) ?? [];
  } catch {
    return [];
  }
}

export async function createReminder(
  formData: FormData
): Promise<ReminderActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const rawData = {
      job_id: formData.get("job_id") as string,
      title: formData.get("title") as string,
      meeting_date: formData.get("meeting_date") as string,
      notes: formData.get("notes") as string,
    };

    const parsed = reminderSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return { success: false, error: firstError };
    }

    const { error } = await supabase.from("job_reminders").insert({
      user_id: user.id,
      job_id: parsed.data.job_id,
      title: parsed.data.title,
      meeting_date: new Date(parsed.data.meeting_date).toISOString(),
      notes: parsed.data.notes || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al agendar la reunión",
    };
  }
}

export async function updateReminder(
  id: string,
  formData: FormData
): Promise<ReminderActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const rawData = {
      job_id: formData.get("job_id") as string,
      title: formData.get("title") as string,
      meeting_date: formData.get("meeting_date") as string,
      notes: formData.get("notes") as string,
    };

    const parsed = reminderSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return { success: false, error: firstError };
    }

    const { error } = await supabase
      .from("job_reminders")
      .update({
        job_id: parsed.data.job_id,
        title: parsed.data.title,
        meeting_date: new Date(parsed.data.meeting_date).toISOString(),
        notes: parsed.data.notes || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al actualizar la reunión",
    };
  }
}

export async function deleteReminder(
  id: string
): Promise<ReminderActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const { error } = await supabase
      .from("job_reminders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al eliminar el recordatorio",
    };
  }
}
