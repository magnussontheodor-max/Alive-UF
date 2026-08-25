/**
 * A single spacing scale keeps whitespace consistent across the app
 * instead of every screen inventing its own magic numbers.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  pill: 999,
} as const;
