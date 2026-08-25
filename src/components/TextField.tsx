import React from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'autoFocus' | 'returnKeyType' | 'onSubmitEditing'>;

/**
 * A single underlined line, not a boxed input — this app has one field
 * on screen at a time, so it doesn't need a "card" to separate it from
 * anything.
 */
export function TextField({ value, onChangeText, placeholder, autoFocus, returnKeyType, onSubmitEditing }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.inkFaint}
      autoFocus={autoFocus}
      autoCorrect={false}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.hero,
    fontSize: 26,
    lineHeight: 34,
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
