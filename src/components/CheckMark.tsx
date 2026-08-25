import React from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Length of the checkmark path below, rounded up — used to animate the
// stroke drawing itself on, rather than just fading in.
const PATH_LENGTH = 26;

type Props = {
  /** 0 = not drawn, 1 = fully drawn. Driven by the parent's timeline. */
  progress: Animated.Value;
  size?: number;
  color?: string;
};

/**
 * A hand-drawn checkmark (not an emoji or icon-font glyph, which render
 * inconsistently across platforms) that draws itself on stroke-by-stroke.
 * This is the "you did it" beat after pressing I'M ALIVE — brief,
 * physical, and specific to this one moment rather than a generic
 * success icon reused everywhere.
 */
export function CheckMark({ progress, size = 56, color = '#F3EEE4' }: Props) {
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [PATH_LENGTH, 0],
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M4 12.5L9.5 18L20 6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={PATH_LENGTH}
        strokeDashoffset={strokeDashoffset}
      />
    </Svg>
  );
}
