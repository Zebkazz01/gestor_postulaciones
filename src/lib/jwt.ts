import { decodeJwt, JWTPayload } from "jose";
import { createClient } from "@/lib/supabase/server";

export interface SupabaseJWTPayload extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Obtiene y decodifica de forma segura el token JWT (access_token)
 * desde las cookies HTTP-Only de Supabase en el servidor.
 */
export async function getDecodedJWT(): Promise<SupabaseJWTPayload | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return null;
    }

    // Decodifica el token JWT firmado por Supabase
    const payload = decodeJwt(session.access_token) as SupabaseJWTPayload;
    return payload;
  } catch (error) {
    console.error("Error decodificando JWT:", error);
    return null;
  }
}
