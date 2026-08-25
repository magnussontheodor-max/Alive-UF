/**
 * ALIVE color palette.
 *
 * Deliberately small and calm: one warm neutral background, one ink for
 * text, one deep, quiet green as the single accent (trust, nature,
 * "okay" — not medical red, not gamified brights), and a couple of
 * muted greys for secondary text and hairlines.
 *
 * If we ever add dark mode, this is the one file that needs a second
 * variant — everything else in the app reads colors from here.
 */
export const colors = {
  background: '#FAF9F6',
  surface: '#FFFFFF',

  ink: '#171814',
  inkMuted: '#6B6D63',
  inkFaint: '#A6A79C',

  accent: '#243B2C',
  accentPressed: '#1A2B21',
  onAccent: '#FAF9F6',

  hairline: '#E7E5DD',
} as const;
