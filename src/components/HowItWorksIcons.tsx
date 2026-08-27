import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

/**
 * Three line-drawn glyphs for the onboarding carousel, in the same
 * stroke-based, no-fill-except-the-dot language as CheckMark — a
 * deliberate contrast against the soft-3D mascot illustrations most
 * "are you okay" apps reach for. Geometric, not decorative: a target
 * for the tap, a bell for the follow-up, two overlapping circles for
 * "you and them."
 */
export function TapGlyph({ size = 40, color = '#20201A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="2.5" fill={color} />
    </Svg>
  );
}

export function FollowUpGlyph({ size = 40, color = '#20201A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 16V10a6 6 0 1 1 12 0v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M4 16h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ContactsGlyph({ size = 40, color = '#20201A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="12" r="6" stroke={color} strokeWidth={2} />
      <Circle cx="15" cy="12" r="6" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
