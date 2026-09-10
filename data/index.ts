import { cookies } from "next/headers";
import { Repositories } from "./repositories";
import { createLocalRepositories } from "./local/store";
import { createSupabaseRepositories } from "./supabase/repositories";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabase/client";

export * from "./repositories";

// ---------------------------------------------------------------------------
// Backend selection.
//
// Supabase when it is configured, the local store otherwise. Nothing else in
// the application branches on this.
// ---------------------------------------------------------------------------

export function getRepositories(): Repositories {
  if (!isSupabaseConfigured()) {
    return createLocalRepositories();
  }
  const client = createSupabaseServerClient(cookies());
  return createSupabaseRepositories(client);
}

export function backendMode(): "local" | "supabase" {
  return isSupabaseConfigured() ? "supabase" : "local";
}
