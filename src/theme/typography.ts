import { Platform } from 'react-native';

/**
 * Two typefaces, each doing one job — a classic editorial pairing
 * (think Kinfolk, Cereal, COS) rather than one font stretched across
 * every role:
 *
 * - Fraunces (serif) carries the few words that should feel warm and
 *   considered: the greeting, the confirmation. It's a "soft" serif
 *   with a bit of personality, not a stiff formal one — it reads
 *   human, not corporate.
 * - The system typeface (San Francisco / Roboto) carries everything
 *   functional — body text, labels, the button — because it's
 *   extremely legible at small sizes and free.
 *
 * v2: pushed toward "magazine cover, not app label" — the serif is
 * bigger, heavier, and set tighter (a dense stacked headline instead
 * of an airy paragraph), and the tracked-caps labels went smaller and
 * more tracked-out for contrast against it. Type is doing more of the
 * brand identity work now; this is the one file that carries that, so
 * every screen picks it up automatically.
 *
 * The serif is a real dependency (`@expo-google-fonts/fraunces` +
 * `expo-font`) loaded once at startup in App.tsx. Everything else
 * still avoids adding fonts/animation/icon libraries.
 */
const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const serif = 'Fraunces_500Medium';
const serifSemiBold = 'Fraunces_600SemiBold';

export const typography = {
  fontFamily: sans,

  /** Small quiet brand mark (in-app). */
  wordmark: {
    fontFamily: serifSemiBold,
    fontSize: 15,
    letterSpacing: 4,
  },
  /** "TUESDAY · 25 AUGUST" above the headline — small and sharply tracked, a deliberate contrast against the huge hero below it. */
  eyebrow: {
    fontFamily: sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  /** The big stacked headline — dense leading, heavier weight, tight tracking. Wrapping to 2–3 lines is expected and part of the look. */
  hero: {
    fontFamily: serifSemiBold,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  body: {
    fontFamily: sans,
    fontSize: 18,
    lineHeight: 26,
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
  /** Serif figures for a value like a time — bigger and heavier than before, to hold its own against the tracked-caps label next to it. */
  value: {
    fontFamily: serifSemiBold,
    fontSize: 23,
    lineHeight: 28,
  },
  caption: {
    fontFamily: sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;
