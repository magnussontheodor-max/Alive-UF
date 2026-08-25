/**
 * ALIVE color palette — v2.
 *
 * Moved away from a plain off-white/bright-green "safety app" look
 * (the SnugSafety / Are You Dead Yet pattern: white background, a flat
 * green go-button) toward something closer to Scandinavian product and
 * editorial design: warm linen instead of stark white, a deep,
 * desaturated pine rather than a saturated "success" green, and warm
 * greys instead of cool ones. Nothing here is meant to say "you are
 * safe" the way traffic-light green does — it's meant to feel like a
 * considered, physical object.
 */
export const colors = {
  background: '#F3EEE4',
  surface: '#FFFFFF',

  ink: '#20201A',
  inkMuted: '#6E6A5B',
  inkFaint: '#A6A08B',

  accent: '#333F2C',
  accentPressed: '#242D20',
  onAccent: '#F3EEE4',

  hairline: '#E1D9C8',
} as const;
