import { Platform } from 'react-native';

/**
 * One typeface, doing every job — the "Beacon" direction's own rule:
 * a signal doesn't have handwriting. The earlier serif/sans pairing
 * (Fraunces for the "warm" moments, system sans for function) carried
 * real brand-identity weight, but a display serif is also exactly the
 * default this direction exists to refuse — see colors.ts. Weight and
 * tracking now carry what the serif used to: the hero is heavier and
 * tighter, not a different letterform.
 *
 * No custom font file to load — the system typeface (San Francisco /
 * Roboto) is free, always legible, and appropriate for an instrument
 * reading, not a magazine headline.
 */
const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily: sans,

  /** The brand mark — set like a signal callsign, not a logotype. */
  wordmark: {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 6,
  },
  /** "TUESDAY · 25 AUGUST" above the headline — small and sharply tracked. */
  eyebrow: {
    fontFamily: sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  /** The big stacked headline — heavy weight, tight tracking carries the presence a serif display used to. */
  hero: {
    fontFamily: sans,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: sans,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400' as const,
  },
  bodyMuted: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400' as const,
  },
  button: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700' as const,
    letterSpacing: 2.2,
  },
  /** Tracked-caps row label, e.g. "CHECKED IN TODAY". */
  label: {
    fontFamily: sans,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
  },
  /** A value like a time — heavier and bigger than body, holds its own against the tracked-caps label next to it. */
  value: {
    fontFamily: sans,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;
