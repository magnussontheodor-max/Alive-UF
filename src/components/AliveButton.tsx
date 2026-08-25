import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CheckMark } from './CheckMark';
import { colors, typography } from '../theme';

const SIZE = 196;
const RING_GAP = 18;

type Props = {
  label: string;
  onPress: () => void;
  /** True once the check-in has registered — swaps the label for a checkmark and disables further taps. */
  confirmed: boolean;
};

/**
 * The single, unmistakable call to action of the app. Styled less like
 * a flat "go" button and more like a physical dial — a quiet outer
 * ring around a solid disc, the kind of detail Scandinavian product
 * design (Braun, Bang & Olufsen) uses to make a single control feel
 * deliberate rather than decorative.
 *
 * On press it doesn't just disappear — the label calmly gives way to a
 * hand-drawn checkmark that draws itself on, so the moment of "this
 * worked" has somewhere to land before the screen moves on.
 */
export function AliveButton({ label, onPress, confirmed }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (confirmed) {
      Animated.timing(reveal, {
        toValue: 1,
        duration: 480,
        delay: 90,
        useNativeDriver: true,
      }).start();
    }
  }, [confirmed, reveal]);

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

  const labelStyle = {
    opacity: reveal.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' as const }),
  };
  const markStyle = {
    opacity: reveal.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
    transform: [
      {
        scale: reveal.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.7, 0.7, 1] }),
      },
    ],
  };

  return (
    <View style={styles.ring}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={confirmed ? "You're checked in" : label}
          hitSlop={12}
          style={styles.button}
        >
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
          <Animated.View style={[styles.mark, markStyle]} pointerEvents="none">
            <CheckMark progress={reveal} color={colors.onAccent} />
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
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(243, 238, 228, 0.14)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  label: {
    ...typography.button,
    color: colors.onAccent,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
  },
});
