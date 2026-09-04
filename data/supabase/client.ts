import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase clients
//
// `isSupabaseConfigured()` is the single switch that decides which backend the
// whole application uses. When it returns false, nothing here is constructed
// and the local store takes over.
// ---------------------------------------------------------------------------

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function supabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

/**
 * Server client bound to the request's cookies, so RLS sees the signed-in user.
 * `cookieStore` is passed in rather than imported to keep this file usable from
 * both server components and route handlers.
 */
export function createSupabaseServerClient(cookieStore: {
  get(name: string): { value: string } | undefined;
  set?(name: string, value: string, options: CookieOptions): void;
}): SupabaseClient {
  const { url, anonKey } = supabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set?.(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set?.(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}

/** Browser client, for auth flows initiated client-side. */
export function createSupabaseBrowserClient(): SupabaseClient {
  const { url, anonKey } = supabaseConfig();
  return createClient(url, anonKey);
}
