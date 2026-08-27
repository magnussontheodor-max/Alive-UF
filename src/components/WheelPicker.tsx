import React, { useRef } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { colors, typography } from '../theme';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const HALF = Math.floor(VISIBLE_COUNT / 2);

type Props = {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width?: number;
  accessibilityLabel?: string;
};

/**
 * A hand-rolled time wheel, not the system date/time picker — this is
 * the piece that most needed to not look like every other "safety app"
 * onboarding. Fraunces numerals instead of the OS's own type, and
 * values fade + shrink around a quiet two-hairline band rather than
 * sitting in a boxed pill. Scroll, let go, it snaps to the nearest
 * value — `snapToInterval` + `decelerationRate="fast"` do the actual
 * snapping; the interpolated opacity/scale is purely cosmetic and rides
 * the same scroll position on the native thread.
 */
export function WheelPicker({ items, selectedIndex, onChange, width = 84, accessibilityLabel }: Props) {
  const scrollY = useRef(new Animated.Value(selectedIndex * ITEM_HEIGHT)).current;

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    if (clamped !== selectedIndex) onChange(clamped);
  };

  return (
    <View
      style={[styles.container, { width, height: ITEM_HEIGHT * VISIBLE_COUNT }]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View pointerEvents="none" style={[styles.centerBand, { top: ITEM_HEIGHT * HALF, height: ITEM_HEIGHT }]} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * HALF }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
      >
        {items.map((label, index) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.22, 0.42, 1, 0.42, 0.22],
            extrapolate: 'clamp',
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.74, 0.86, 1, 0.86, 0.74],
            extrapolate: 'clamp',
          });
          return (
            <View key={`${label}-${index}`} style={[styles.item, { height: ITEM_HEIGHT }]}>
              <Animated.Text style={[styles.itemText, { opacity, transform: [{ scale }] }]}>
                {label}
              </Animated.Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  centerBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: typography.hero.fontFamily,
    fontSize: 28,
    color: colors.ink,
  },
});
