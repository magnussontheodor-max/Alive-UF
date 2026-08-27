import React, { useRef } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

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
 * sitting in a boxed pill.
 *
 * Two ways to set a value, not one: drag-and-snap (`snapToInterval` +
 * `decelerationRate="fast"`, committed in `onMomentumScrollEnd`), and a
 * direct tap on any visible number (`scrollTo` to re-center it, commit
 * immediately). The tap path exists because a vertical scroll wheel
 * nested inside this screen's own vertical scroll container is a
 * known-flaky gesture on a real device — a parent ScrollView often
 * wins the touch before this one sees it. Tapping doesn't depend on
 * that gesture resolving in this component's favor at all, so the
 * picker stays usable even where the surrounding screen can't have its
 * own scrolling turned off (Settings, which needs to scroll for its
 * other sections).
 */
export function WheelPicker({ items, selectedIndex, onChange, width = 84, accessibilityLabel }: Props) {
  const scrollY = useRef(new Animated.Value(selectedIndex * ITEM_HEIGHT)).current;
  const scrollRef = useRef<ScrollView>(null);

  const commit = (index: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    if (clamped !== selectedIndex) onChange(clamped);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    commit(Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT));
  };

  const handleItemPress = (index: number) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    commit(index);
  };

  return (
    <View
      style={[styles.container, { width, height: ITEM_HEIGHT * VISIBLE_COUNT }]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View pointerEvents="none" style={[styles.centerBand, { top: ITEM_HEIGHT * HALF, height: ITEM_HEIGHT }]} />
      <Animated.ScrollView
        ref={scrollRef}
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
            <Pressable
              key={`${label}-${index}`}
              onPress={() => handleItemPress(index)}
              style={[styles.item, { height: ITEM_HEIGHT }]}
            >
              <Animated.Text style={[styles.itemText, { opacity, transform: [{ scale }] }]}>
                {label}
              </Animated.Text>
            </Pressable>
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
