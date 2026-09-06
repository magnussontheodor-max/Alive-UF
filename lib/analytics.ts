// ---------------------------------------------------------------------------
// Analytics
//
// A typed event list and a no-op sink. No provider is configured yet, and
// rather than pull in a vendor SDK for a page that does not need one, the
// call sites are written now and the transport is left as a single function
// to replace.
//
// To connect PostHog (or anything else) later, implement `send` — nothing at
// any call site changes.
// ---------------------------------------------------------------------------

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "hero_cta_click" }
  | { name: "waitlist_form_started"; source: string }
  | { name: "waitlist_submitted"; source: string; outcome: "added" | "already_on_list" | "failed" }
  | { name: "journey_stage_clicked"; stage: string }
  | { name: "product_visual_interaction"; visual: string };

type Sink = (event: AnalyticsEvent) => void;

const noop: Sink = () => {};

let sink: Sink = noop;

/** Swap in a real provider once one exists. */
export function setAnalyticsSink(next: Sink): void {
  sink = next;
}

export function track(event: AnalyticsEvent): void {
  try {
    sink(event);
  } catch {
    // Analytics must never break the page.
  }
}

/** UTM parameters, read from the current URL. Browser only. */
export function readUtm(): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  if (typeof window === "undefined") {
    return { utmSource: null, utmMedium: null, utmCampaign: null };
  }
  const params = new URLSearchParams(window.location.search);
  const value = (key: string) => params.get(key)?.slice(0, 120) || null;
  return {
    utmSource: value("utm_source"),
    utmMedium: value("utm_medium"),
    utmCampaign: value("utm_campaign"),
  };
}
