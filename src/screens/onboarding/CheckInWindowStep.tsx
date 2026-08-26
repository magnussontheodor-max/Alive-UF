import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckMark } from '../../components/CheckMark';
import { colors, radius, spacing, typography } from '../../theme';
import { CHECK_IN_WINDOW_OPTIONS, CheckInWindow, CheckInWindowOption } from '../../types/profile';

type Props = {
  value: CheckInWindow;
  onChange: (window: CheckInWindow) => void;
  /** Omit for the onboarding copy (default); pass null to hide the heading — used when Settings supplies its own section label. */
  title?: string | null;
  subtitle?: string | null;
};

const DEFAULT_TITLE = 'When should we check in?';
const DEFAULT_SUBTITLE = 'Pick the time of day that fits you best.';

/** Reused as-is in Settings; only knows about `value`/`onChange`, not where the choice ends up. */
export function CheckInWindowStep({
  value,
  onChange,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
}: Props) {
  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.options, !title && styles.optionsNoTitle]}>
        {CHECK_IN_WINDOW_OPTIONS.map((option) => (
          <WindowOptionRow
            key={option.id}
            option={option}
            selected={option.id === value}
            onSelect={() => onChange(option.id)}
          />
        ))}
      </View>
    </View>
  );
}

function WindowOptionRow({
  option,
  selected,
  onSelect,
}: {
  option: CheckInWindowOption;
  selected: boolean;
  onSelect: () => void;
}) {
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
      accessibilityLabel={`${option.label}, ${option.hours}`}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View>
        <Text style={styles.optionLabel}>{option.label}</Text>
        <Text style={styles.optionHours}>{option.hours}</Text>
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
  title: {
    ...typography.hero,
    color: colors.ink,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  options: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  optionsNoTitle: {
    marginTop: 0,
  },
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
  optionLabel: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '500',
  },
  optionHours: {
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
