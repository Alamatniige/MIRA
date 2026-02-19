// Placeholder - initialize Supabase client
// import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = {
  url: supabaseUrl,
  key: supabaseAnonKey,
  // createClient(supabaseUrl, supabaseAnonKey) when @supabase/supabase-js is installed
};
