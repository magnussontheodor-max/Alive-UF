import { Platform } from 'react-native';

/**
 * We lean on the system typeface (San Francisco on iOS, Roboto on
 * Android) rather than bundling a custom font. Both are excellent,
 * well-hinted, premium-feeling typefaces on their own platforms — using
 * them keeps the app feeling native and fast, and avoids pulling in
 * expo-font plus font files for a foundation this early. We can
 * introduce a brand typeface later without touching anything that
 * reads from this file.
 */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily,

  hero: {
    fontFamily,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMuted: {
    fontFamily,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400' as const,
  },
  button: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
  },
  label: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;
