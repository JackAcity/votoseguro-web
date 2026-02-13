import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente único reutilizable (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Sin sesión persistente — usuarios anónimos por defecto
    persistSession: false,
    autoRefreshToken: false,
  },
})
