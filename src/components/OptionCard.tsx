import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { CheckMark } from './CheckMark';

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  accessibilityLabel?: string;
  /** An icon glyph component (e.g. from HowItWorksIcons), shown in a small badge to the left of the text. */
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

/**
 * A bordered, radio-style choice row — the label/description on the
 * left, a hand-drawn checkmark that draws itself on when selected on
 * the right. Pulled out of what used to be CheckInWindowStep's own
 * WindowOptionRow so PersonaStep and GracePeriodStep get the exact
 * same considered feel instead of each rolling their own card.
 */
export function OptionCard({ label, description, selected, onSelect, accessibilityLabel, icon: Icon }: Props) {
  const reveal = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: selected ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selected, reveal]);

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.option, selected && styles.optionSelected]}
    >
      {Icon ? (
        <View style={[styles.iconBadge, selected && styles.iconBadgeSelected]}>
          <Icon size={20} color={selected ? colors.accent : colors.inkMuted} />
        </View>
      ) : null}
      <View style={styles.textCol}>
        <Text style={styles.optionLabel}>{label}</Text>
        {description ? <Text style={styles.optionDescription}>{description}</Text> : null}
      </View>
      <View style={styles.radio}>
        <Animated.View style={{ opacity: reveal }}>
          <CheckMark progress={reveal} size={18} color={colors.accent} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: {
    borderColor: colors.accent,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconBadgeSelected: {
    borderColor: colors.accent,
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  optionLabel: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '500',
  },
  optionDescription: {
    ...typography.bodyMuted,
    color: colors.inkMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
