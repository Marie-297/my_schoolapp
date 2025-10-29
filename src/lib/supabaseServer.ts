import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are missing!");
}

// ✅ Export one shared server instance
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
