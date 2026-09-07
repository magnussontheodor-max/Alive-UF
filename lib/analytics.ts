// ---------------------------------------------------------------------------
// Analytics
//
// A typed event list and one function to replace. The default sink forwards to
// Umami when its script is present and does nothing when it is not, so the
// page works identically with analytics blocked, disabled or not yet set up.
//
// Umami is cookie-free and stores no personal data, which is why there is no
// cookie banner on this site. Nothing here may ever send an email address or
// anything else that identifies a person — only that an event happened.
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "signup_completed" }
  | { name: "hero_cta_click" }
  | { name: "signup_form_started" }
  | { name: "journey_stage_clicked"; stage: string }
  | { name: "product_visual_interaction"; visual: string };

type Sink = (event: AnalyticsEvent) => void;

/** Page views are counted by Umami's own script, so only custom events are
 *  forwarded here — sending both would double-count every visit. */
const umamiSink: Sink = (event) => {
  if (typeof window === "undefined" || !window.umami) return;
  if (event.name === "page_view") return;

  const { name, ...rest } = event;
  window.umami.track(name, Object.keys(rest).length ? rest : undefined);
};

let sink: Sink = umamiSink;

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
