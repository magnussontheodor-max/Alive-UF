export type HowItWorksItem = {
  number: string;
  headline: string;
  description: string;
};

/**
 * The three-sentence version of the whole product. Shared between the
 * onboarding step and the standalone "How ALIVE works" screen reachable
 * from Settings, so the explanation only exists in one place.
 */
export const HOW_IT_WORKS: HowItWorksItem[] = [
  {
    number: '01',
    headline: 'Check in once a day',
    description: "One tap tells everyone you're okay.",
  },
  {
    number: '02',
    headline: 'Missed check-in',
    description: 'We follow up with a gentle reminder first.',
  },
  {
    number: '03',
    headline: 'Trusted contact contacted',
    description: "Only if we still haven't heard from you.",
  },
];
