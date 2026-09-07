import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isDatabaseConfigured, siteUrl } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET /api/unsubscribe?token=...
//
// The token is HMAC-signed and carries its own action, so it cannot be guessed
// and cannot be replayed against the deletion route. The row is kept — an
// unsubscribe is a record that this address asked not to be written to, which
// is the thing that stops us mailing them again.
// ---------------------------------------------------------------------------

function redirect(status: "ok" | "fel") {
  return NextResponse.redirect(`${siteUrl()}/avregistrerad?status=${status}`, { status: 303 });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const id = verifyToken("unsubscribe", token);

  if (!id) return redirect("fel");
  if (!isDatabaseConfigured()) return redirect("fel");

  try {
    const { error } = await supabaseAdmin()
      .from("signups")
      .update({ unsubscribed: true })
      .eq("id", id);

    if (error) {
      console.error("[unsubscribe] misslyckades", error.message);
      return redirect("fel");
    }
    return redirect("ok");
  } catch (error) {
    console.error("[unsubscribe] oväntat fel", error);
    return redirect("fel");
  }
}
