import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * A quiet fade + rise, replayed every time `dep` changes. Used anywhere
 * content swaps in place (the check-in confirmation, onboarding steps)
 * so the change reads as considered rather than a jump cut.
 */
export function useEntranceStyle(dep: unknown, options?: { duration?: number; delay?: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: options?.duration ?? 400,
      delay: options?.delay ?? 40,
      useNativeDriver: true,
    }).start();
    // Deliberately keyed only on `dep` — the animation should replay
    // when that changes, not when `options` is a new object each render.
  }, [dep]);

  return {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };
}
