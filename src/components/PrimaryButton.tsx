import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

/**
 * The CTA for onboarding steps — a pill, deliberately not a circle.
 * The circle is reserved for the one daily ritual (AliveButton); every
 * other action in the app should look like a normal, lighter-weight
 * button so that reservation keeps its meaning.
 *
 * The press itself, though, is deliberately tuned to feel like the
 * same object as AliveButton — same spring, same depth of squish, a
 * firm haptic on commit — and it waits for that press to visibly
 * finish before advancing, rather than cutting to the next step mid-
 * animation. What it skips on purpose is AliveButton's checkmark and
 * held pause: repeating that on every "Continue" tap through a form
 * would slow onboarding down and dilute what makes the daily check-in
 * moment feel special.
 */
export function PrimaryButton({ label, onPress, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handlePressIn = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 10 }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Let the press-out spring visibly settle before the screen changes,
    // instead of cutting away mid-motion.
    advanceTimer.current = setTimeout(onPress, 180);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled }}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    backgroundColor: colors.hairline,
  },
  label: {
    ...typography.button,
    color: colors.onAccent,
  },
  labelDisabled: {
    color: colors.inkFaint,
  },
});
