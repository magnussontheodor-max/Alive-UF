import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isDatabaseConfigured, siteUrl } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET /api/delete-me?token=...
//
// Article 17, done properly: the row is removed, not flagged. Any queued mail
// to that address goes with it, so a deletion cannot be followed by a message
// that was already waiting in the queue.
// ---------------------------------------------------------------------------

function redirect(status: "ok" | "fel") {
  return NextResponse.redirect(`${siteUrl()}/raderad?status=${status}`, { status: 303 });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const id = verifyToken("delete", token);

  if (!id) return redirect("fel");
  if (!isDatabaseConfigured()) return redirect("fel");

  try {
    const db = supabaseAdmin();

    const found = await db.from("signups").select("email").eq("id", id).maybeSingle();
    if (found.error) {
      console.error("[delete-me] uppslag misslyckades", found.error.message);
      return redirect("fel");
    }
    // Already gone. Say it worked — it did, from the person's point of view.
    if (!found.data) return redirect("ok");

    const email = found.data.email as string;

    const removed = await db.from("signups").delete().eq("id", id);
    if (removed.error) {
      console.error("[delete-me] radering misslyckades", removed.error.message);
      return redirect("fel");
    }

    // Anything still queued to this address would arrive after the deletion.
    const queue = await db.from("email_queue").delete().eq("to_email", email).eq("status", "pending");
    if (queue.error) {
      console.error("[delete-me] kunde inte rensa kön", queue.error.message);
    }

    return redirect("ok");
  } catch (error) {
    console.error("[delete-me] oväntat fel", error);
    return redirect("fel");
  }
}
