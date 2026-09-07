import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceKey, supabaseUrl } from "@/lib/env";

// ---------------------------------------------------------------------------
// Service-role Supabase client
//
// This key bypasses row level security, which is the whole point: the signups
// tables have RLS on and no policies, so nothing but this client can touch
// them. It must therefore never reach the browser.
//
// The guard below is not decoration. Importing this file from a client
// component would bundle the key into the JavaScript served to every visitor,
// and that mistake is silent without it.
// ---------------------------------------------------------------------------

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "supabaseAdmin() anropades i webbläsaren. Service role-nyckeln får aldrig " +
        "lämna servern — importera den här filen bara från route handlers, " +
        "server actions eller server components."
    );
  }

  if (!client) {
    client = createClient(supabaseUrl(), supabaseServiceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "spark-signup" } },
    });
  }

  return client;
}
