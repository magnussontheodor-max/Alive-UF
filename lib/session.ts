import { cookies } from "next/headers";
import { Founder, newId, now } from "@/domain";
import { getRepositories } from "@/data";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/data/supabase/client";

// ---------------------------------------------------------------------------
// Session / identity
//
// Two modes, one interface:
//
//   Supabase configured  → the signed-in auth user, enforced by RLS.
//   Not configured       → a single local founder, created on first use. The
//                          UI shows a "local mode" badge so this is never
//                          mistaken for real authentication.
// ---------------------------------------------------------------------------

const LOCAL_USER_ID = "local-founder";

export interface Session {
  founder: Founder;
  mode: "supabase" | "local";
  authenticated: boolean;
}

export async function getSession(): Promise<Session | null> {
  const repos = getRepositories();

  if (isSupabaseConfigured()) {
    const client = createSupabaseServerClient(cookies());
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return null;

    let founder = await repos.founders.getByUserId(user.id);
    if (!founder) {
      founder = await repos.founders.create({
        id: newId("fdr"),
        userId: user.id,
        name: (user.user_metadata?.name as string) ?? user.email ?? "Founder",
        email: user.email ?? "",
        country: "SE",
        createdAt: now(),
        updatedAt: now(),
      });
    }
    return { founder, mode: "supabase", authenticated: true };
  }

  // Local mode: one implicit founder so the product is usable immediately.
  let founder = await repos.founders.getByUserId(LOCAL_USER_ID);
  if (!founder) {
    founder = await repos.founders.create({
      id: newId("fdr"),
      userId: LOCAL_USER_ID,
      name: "Founder",
      email: "",
      country: "SE",
      createdAt: now(),
      updatedAt: now(),
    });
  }
  return { founder, mode: "local", authenticated: false };
}

/** Throws if there is no session. Use in server actions that require identity. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  return session;
}
