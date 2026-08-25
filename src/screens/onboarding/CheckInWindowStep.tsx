import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckMark } from '../../components/CheckMark';
import { colors, radius, spacing, typography } from '../../theme';
import { CHECK_IN_WINDOW_OPTIONS, CheckInWindow, CheckInWindowOption } from '../../types/profile';

type Props = {
  value: CheckInWindow;
  onChange: (window: CheckInWindow) => void;
};

export function CheckInWindowStep({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.title}>When should we check in?</Text>
      <Text style={styles.subtitle}>Pick the time of day that fits you best.</Text>
      <View style={styles.options}>
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
