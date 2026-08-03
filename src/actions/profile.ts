"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ProfileActionResult = {
  success: boolean;
  error?: string;
};

const profileSchema = z.object({
  full_name: z.string().optional().or(z.literal("")),
  avatar_url: z.string().optional().or(z.literal("")),
});

export async function updateProfile(
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const rawData = {
      full_name: formData.get("full_name") as string,
      avatar_url: formData.get("avatar_url") as string,
    };

    const parsed = profileSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: "Datos de perfil inválidos" };
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: parsed.data.full_name || null,
        avatar_url: parsed.data.avatar_url || null,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al actualizar el perfil",
    };
  }
}

export async function updatePasswordFromProfile(
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Las contraseñas no coinciden",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al cambiar la contraseña",
    };
  }
}

export async function deleteAccount(password: string): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: "No autenticado" };
    }

    // Verify password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (signInError) {
      return {
        success: false,
        error: "Contraseña incorrecta. No se pudo verificar tu identidad.",
      };
    }

    // Delete user jobs data
    await supabase.from("jobs").delete().eq("user_id", user.id);

    // Sign out user session
    await supabase.auth.signOut();

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error inesperado al eliminar la cuenta",
    };
  }
}
