import React from 'react';
import { KeyboardTypeOptions, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  returnKeyType?: 'done' | 'next';
  onSubmitEditing?: () => void;
  keyboardType?: KeyboardTypeOptions;
  /** A small caption above the field — used when more than one field is on screen at once. */
  label?: string;
  /** 'large' (default) is a single full-width question; 'compact' fits alongside other fields. */
  size?: 'large' | 'compact';
};

/**
 * A single underlined line, not a boxed input — this app avoids
 * "cards", so a field is separated from its neighbors with a label and
 * spacing rather than a box.
 */
export function TextField({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  returnKeyType,
  onSubmitEditing,
  keyboardType,
  label,
  size = 'large',
}: Props) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        style={size === 'large' ? styles.inputLarge : styles.inputCompact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
  },
  inputLarge: {
    ...typography.hero,
    fontSize: 26,
    lineHeight: 34,
    color: colors.ink,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    paddingVertical: spacing.sm,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  inputCompact: {
    ...typography.body,
    fontSize: 18,
    color: colors.ink,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    paddingVertical: spacing.sm,
    // The browser's default focus ring only shows in the web preview
    // used for screenshots during development — native TextInput has
    // no such outline on iOS/Android, so this is purely cosmetic there.
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
});
