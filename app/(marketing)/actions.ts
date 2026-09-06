"use server";

import { z } from "zod";
import { getRepositories } from "@/data";
import { newId, normaliseEmail } from "@/domain";

// ---------------------------------------------------------------------------
// Waitlist signup
//
// Validation happens here rather than only in the browser, because the browser
// is not a trustworthy validator. The result is a discriminated union so the
// form can distinguish "you are already on the list" from a real failure —
// telling someone their signup failed when it did not is worse than useless.
// ---------------------------------------------------------------------------

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Skriv ditt förnamn.")
    .max(80, "Det där namnet är ovanligt långt — kontrollera gärna."),
  email: z
    .string()
    .trim()
    .min(1, "Skriv din e-postadress.")
    .max(254)
    .email("Kontrollera e-postadressen.")
    // zod accepts "a@b"; a waitlist address needs a real domain to be reachable.
    .refine((value) => /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(value), "Kontrollera e-postadressen."),
  source: z.string().trim().max(60).default("landing"),
  utmSource: z.string().trim().max(120).nullish(),
  utmMedium: z.string().trim().max(120).nullish(),
  utmCampaign: z.string().trim().max(120).nullish(),
});

export type WaitlistResult =
  | { status: "added" }
  | { status: "already_on_list" }
  | { status: "invalid"; fieldErrors: { firstName?: string; email?: string } }
  | { status: "failed"; message: string };

export async function joinWaitlistAction(input: {
  firstName: string;
  email: string;
  source?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}): Promise<WaitlistResult> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    return {
      status: "invalid",
      fieldErrors: {
        firstName: flattened.firstName?.[0],
        email: flattened.email?.[0],
      },
    };
  }

  const { firstName, email, source, utmSource, utmMedium, utmCampaign } = parsed.data;

  try {
    const outcome = await getRepositories().waitlist.add({
      id: newId("wl"),
      firstName,
      email: normaliseEmail(email),
      source,
      utmSource: utmSource ?? null,
      utmMedium: utmMedium ?? null,
      utmCampaign: utmCampaign ?? null,
      createdAt: new Date().toISOString(),
    });

    if (outcome.kind === "ADDED") return { status: "added" };
    if (outcome.kind === "ALREADY_ON_LIST") return { status: "already_on_list" };
    return { status: "failed", message: outcome.reason };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Okänt fel.",
    };
  }
}
