import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '../../components/TextField';
import { colors, spacing, typography } from '../../theme';

type Props = {
  title: string;
  subtitle: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
};

/** A generic "one question, one answer" step — used for both the user's name and their trusted contact's name. */
export function TextStep({ title, subtitle, value, onChangeText, placeholder, onSubmitEditing }: Props) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.fieldWrap}>
        <TextField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
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
  fieldWrap: {
    marginTop: spacing.xl,
  },
});
