// ---------------------------------------------------------------------------
// Environment
//
// Read through here rather than touching process.env at call sites, so a
// missing variable fails with a sentence that names it instead of a
// `undefined is not a string` three frames deeper.
//
// Nothing in this file is imported by a client component. The values that the
// browser legitimately needs are the NEXT_PUBLIC_ ones, exposed separately at
// the bottom.
// ---------------------------------------------------------------------------

function optional(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

function required(name: string): string {
  const value = optional(name);
  if (!value) {
    throw new Error(
      `Saknad miljövariabel: ${name}. Se .env.example för vad den ska innehålla.`
    );
  }
  return value;
}

/** The public origin, with no trailing slash. Used for links in email and OG. */
export function siteUrl(): string {
  const raw = optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function supabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

/** Server only. Bypasses row level security — never expose to the browser. */
export function supabaseServiceKey(): string {
  return required("SUPABASE_SERVICE_ROLE_KEY");
}

/** Signs unsubscribe and deletion tokens, and hashes IPs for rate limiting. */
export function tokenSecret(): string {
  return required("TOKEN_SECRET");
}

export function emailProviderName(): string {
  return optional("EMAIL_PROVIDER") ?? "brevo";
}

export function brevoApiKey(): string {
  return required("BREVO_API_KEY");
}

export function emailFrom(): { email: string; name: string } {
  return {
    email: required("EMAIL_FROM"),
    name: optional("EMAIL_FROM_NAME") ?? "Spark",
  };
}

/** Where the daily backup lands, and the contact address in the policy. */
export function adminEmail(): string {
  return required("ADMIN_EMAIL");
}

export function adminBasicAuth(): { user: string; password: string } {
  return {
    user: required("ADMIN_USER"),
    password: required("ADMIN_PASSWORD"),
  };
}

/** Shared secret the daily cron route requires in x-cron-secret. */
export function cronSecret(): string {
  return required("CRON_SECRET");
}

/** How many messages the daily drain may send, i.e. the provider's ceiling. */
export function emailDailyQuota(): number {
  const raw = optional("EMAIL_DAILY_QUOTA");
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300;
}

/** True when the database is wired up; false in a bare local checkout. */
export function isDatabaseConfigured(): boolean {
  return Boolean(optional("NEXT_PUBLIC_SUPABASE_URL") && optional("SUPABASE_SERVICE_ROLE_KEY"));
}

export function isEmailConfigured(): boolean {
  return Boolean(optional("BREVO_API_KEY") && optional("EMAIL_FROM"));
}

/** Cookie-free analytics. Both must be set or the script is not rendered. */
export function umami(): { src: string; websiteId: string } | null {
  const src = optional("NEXT_PUBLIC_UMAMI_SRC");
  const websiteId = optional("NEXT_PUBLIC_UMAMI_WEBSITE_ID");
  return src && websiteId ? { src, websiteId } : null;
}
