import { supabaseAdmin } from "@/lib/supabase/admin";
import { hashIdentifier } from "@/lib/tokens";
import { isDatabaseConfigured } from "@/lib/env";

// ---------------------------------------------------------------------------
// Rate limiting
//
// The counter lives in Postgres, not in a module variable. Vercel's functions
// do not share memory between invocations — two requests can land on two cold
// instances and each see an empty counter — so an in-process limiter limits
// nothing at all in production while looking convincing in development.
//
// The prune, count and insert happen inside one SQL function so the check is
// atomic; done as three round trips, two simultaneous requests both read the
// same count and both pass.
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean;
  /** True when the limiter itself could not run, so the caller can log it. */
  degraded: boolean;
}

export async function checkRateLimit(options: {
  bucket: string;
  identifier: string;
  max: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  // Without a database there is nothing to count in. Local development is not
  // a place worth failing closed.
  if (!isDatabaseConfigured()) return { allowed: true, degraded: true };

  try {
    const { data, error } = await supabaseAdmin().rpc("check_rate_limit", {
      p_bucket: options.bucket,
      p_identifier: hashIdentifier(options.identifier),
      p_max: options.max,
      p_window_seconds: options.windowSeconds,
    });

    if (error) {
      console.error("[rate-limit] rpc misslyckades", error.message);
      // Fail open. A limiter that is down must not take signups down with it;
      // the honeypot and the unique index still stand between us and abuse.
      return { allowed: true, degraded: true };
    }

    return { allowed: data === true, degraded: false };
  } catch (error) {
    console.error("[rate-limit] oväntat fel", error);
    return { allowed: true, degraded: true };
  }
}

/** The caller's address, as far as the platform will tell us. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
