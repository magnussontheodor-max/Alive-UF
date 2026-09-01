export type HowItWorksItem = {
  number: string;
  headline: string;
  description: string;
};

/**
 * Leads with the actual situation (distance, the ambiguity of a missed
 * call, not wanting to feel like you're checking up on someone) before
 * the three-row mechanism below it explains what ALIVE actually does
 * about it — shown above `HOW_IT_WORKS` wherever `HowItWorksRows`
 * renders, so the problem framing and the mechanism always travel
 * together.
 */
export const HOW_IT_WORKS_INTRO =
  "Distance makes you worry. A missed call could mean anything, or nothing — and there's rarely a good way to check without it feeling like checking up on someone. ALIVE is how you know, quietly, every day.";

/**
 * The three-sentence version of the whole product. Shared between the
 * onboarding step and the standalone "How ALIVE works" screen reachable
 * from Settings, so the explanation only exists in one place. Each row
 * ends on the emotional payoff (never wondering, never watched), not
 * just the mechanism, so the list reads as reassurance, not a spec.
 */
export const HOW_IT_WORKS: HowItWorksItem[] = [
  {
    number: '01',
    headline: 'Check in, once a day',
    description: "One tap. That's the whole thing — no explaining, no details.",
  },
  {
    number: '02',
    headline: "If it's quiet, we follow up gently",
    description: 'A soft reminder first, in case the day just got away from you.',
  },
  {
    number: '03',
    headline: 'Only real silence reaches anyone else',
    description: "Past the grace period you chose, the people who care are told — so they're never left wondering, and you're never watched.",
  },
];
