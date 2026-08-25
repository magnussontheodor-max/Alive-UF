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

  /** Small quiet brand mark. */
  wordmark: {
    fontFamily: serifSemiBold,
    fontSize: 15,
    letterSpacing: 3,
  },
  /** "TUESDAY · 25 AUGUST" above the greeting. */
  eyebrow: {
    fontFamily: sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 1.6,
  },
  hero: {
    fontFamily: serif,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.2,
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
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 2,
  },
  /** Tracked-caps row label, e.g. "CHECKED IN TODAY". */
  label: {
    fontFamily: sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
  },
  /** Serif figures for a value like a time — warmer than digital-looking sans numerals. */
  value: {
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 24,
  },
  caption: {
    fontFamily: sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;
