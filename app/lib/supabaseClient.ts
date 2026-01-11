import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

if (!supabaseUrl) throw new Error("SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL is required");
if (!supabaseAnonKey) throw new Error("SUPABASE_ANON_KEY / SUPABASE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY is required");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);