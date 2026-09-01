import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CheckMark } from './CheckMark';
import { colors, typography } from '../theme';

const SIZE = 196;
const RING_GAP = 18;
/** How far past the outer ring the confirm ripple expands before fading out. */
const RIPPLE_OVERSHOOT = 22;

type Props = {
  label: string;
  onPress: () => void;
  /** True once the check-in has registered — swaps the label for a checkmark and disables further taps. */
  confirmed: boolean;
};

/**
 * The beacon. Unlit at idle — a dark housing with just a dim amber
 * outline, an invitation rather than a demand — and it genuinely
 * lights on confirm: the fill itself animates from housing-dark to
 * full signal-amber, not just a checkmark appearing on a button that
 * was already "on". This is the one light source on the whole screen
 * (see theme/colors.ts) — the literal mechanism of the product, not a
 * decorative glow.
 */
export function AliveButton({ label, onPress, confirmed }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  // A single ring blooming outward once, on confirm only — the light's
  // glow spreading, not a decorative loop. Never fires on its own.
  const ripple = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduceMotion(enabled);
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!confirmed) return;
    if (reduceMotion) {
      // No animated light-up, no ripple — the beacon is simply lit.
      reveal.setValue(1);
      return;
    }
    // Not useNativeDriver: the fill-color interpolation below can't run
    // on the native thread; this is a single one-time transition, not
    // a continuous animation, so the cost is negligible.
    Animated.timing(reveal, {
      toValue: 1,
      duration: 480,
      delay: 90,
      useNativeDriver: false,
    }).start();
    Animated.timing(ripple, {
      toValue: 1,
      duration: 650,
      delay: 90,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [confirmed, reduceMotion, reveal, ripple]);

  const handlePressIn = () => {
    if (confirmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (confirmed) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 10,
    }).start();
  };

  const handlePress = () => {
    if (confirmed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPress();
  };

  const fillStyle = {
    backgroundColor: reveal.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.surface, colors.accent],
    }),
    borderColor: reveal.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 180, 84, 0.5)', 'rgba(26, 19, 5, 0.18)'],
    }),
  };
  const labelStyle = {
    opacity: reveal.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' as const }),
    color: colors.accent,
  };
  const markStyle = {
    opacity: reveal.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
    transform: [
      {
        scale: reveal.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.7, 0.7, 1] }),
      },
    ],
  };
  // Same center and starting size as the button itself — the glow
  // reads as the beacon's own light spreading, not an unrelated effect
  // layered on top.
  const rippleStyle = {
    opacity: ripple.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.4, 0] }),
    transform: [
      {
        scale: ripple.interpolate({
          inputRange: [0, 1],
          outputRange: [1, (SIZE + RIPPLE_OVERSHOOT * 2) / SIZE],
        }),
      },
    ],
  };

  return (
    <View style={styles.ring}>
      <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={confirmed ? "You're checked in" : label}
          hitSlop={12}
          style={styles.buttonWrap}
        >
          <Animated.View style={[styles.button, fillStyle]}>
            <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
            <Animated.View style={[styles.mark, markStyle]} pointerEvents="none">
              <CheckMark progress={reveal} color={colors.onAccent} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: SIZE + RING_GAP * 2,
    height: SIZE + RING_GAP * 2,
    borderRadius: (SIZE + RING_GAP * 2) / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: colors.accent,
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  label: {
    ...typography.button,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
  },
  ripple: {
    position: 'absolute',
    top: RING_GAP,
    left: RING_GAP,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.accent,
  },
});
