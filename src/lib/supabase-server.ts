/**
 * Cliente Supabase para Server Components de Next.js.
 * Usa la anon key — el cliente no lleva sesión de usuario.
 * NO importar desde Client Components ("use client").
 */
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, key, {
    auth: {
      // Server Component — sin sesión persistente
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
