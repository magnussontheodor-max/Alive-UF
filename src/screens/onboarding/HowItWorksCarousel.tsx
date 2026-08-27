import React, { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ContactsGlyph, FollowUpGlyph, TapGlyph } from '../../components/HowItWorksIcons';
import { OnboardingProgress } from '../../components/OnboardingProgress';
import { HOW_IT_WORKS } from '../../data/howItWorks';
import { colors, radius, spacing, typography } from '../../theme';

const ICONS = [TapGlyph, FollowUpGlyph, ContactsGlyph];

/**
 * The three-beat explainer as a swipeable carousel, one idea per
 * slide — paced like a short read instead of a list to scan in one
 * glance. This is onboarding-only: the "How ALIVE works" recall page
 * reachable from Settings keeps HowItWorksRows, the dense stacked
 * list, because scanning quickly is the point once someone already
 * knows the app.
 *
 * Each slide leans on a real visual anchor — the glyph sits inside a
 * bordered circle, not floating loose — and repeats the numbered-step
 * pattern HowItWorksRows already established, so the two versions of
 * this explainer read as the same idea, not two different components
 * that happen to share text.
 */
export function HowItWorksCarousel() {
  const [width, setWidth] = useState(0);
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setSlide(Math.max(0, Math.min(HOW_IT_WORKS.length - 1, index)));
  };

  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setSlide(index);
  };

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
        >
          {HOW_IT_WORKS.map((item, index) => {
            const Icon = ICONS[index] ?? TapGlyph;
            return (
              <View key={item.number} style={[styles.slide, { width }]}>
                <View style={styles.iconBadge}>
                  <Icon size={32} color={colors.ink} />
                </View>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.headline}>{item.headline}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            );
          })}
        </ScrollView>
      ) : null}
      <View style={styles.dots}>
        <OnboardingProgress total={HOW_IT_WORKS.length} current={slide} onSelect={goToSlide} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    ...typography.label,
    color: colors.inkFaint,
    marginTop: spacing.lg,
  },
  headline: {
    ...typography.hero,
    fontSize: 30,
    lineHeight: 34,
    color: colors.ink,
    marginTop: spacing.xs,
    maxWidth: 300,
  },
  description: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  dots: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
