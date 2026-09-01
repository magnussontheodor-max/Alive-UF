/**
 * ALIVE color palette — "Beacon" direction.
 *
 * Replaces the earlier warm-cream/serif palette, which — despite
 * being a deliberate move away from a flat white/bright-green
 * "safety app" look — still landed in exactly the cluster AI-generated
 * interfaces default to regardless of subject: warm cream ground,
 * high-contrast serif display, a muted accent. Recognizable as
 * "considered design" in the abstract, not as *this* product.
 *
 * Beacon instead: a near-black ground and one warm signal-lamp color
 * that means "here" — the literal mechanism of the product (a light
 * that says someone is present, visible without contact) rather than
 * a generic calm-app mood. The check-in button doesn't sit on this
 * ground, it's the one light source in it, the way a real beacon
 * reads against open water at night.
 */
export const colors = {
  background: '#0A0D12',
  surface: '#12161F',

  ink: '#F2EFE9',
  inkMuted: '#9A9690',
  inkFaint: '#5C5A56',

  /** The signal lamp itself — every "on" state, the check-in button, the one warm note in an otherwise dark, quiet field. */
  accent: '#FFB454',
  accentPressed: '#E0993D',
  /** Text/icon color sitting directly on the lit accent — dark, not white, for the graphic punch of ink on a lamp. */
  onAccent: '#1A1305',

  hairline: 'rgba(242, 239, 233, 0.10)',
} as const;
