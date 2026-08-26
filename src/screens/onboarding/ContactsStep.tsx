import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TextField } from '../../components/TextField';
import { colors, radius, spacing, typography } from '../../theme';
import { MAX_TRUSTED_CONTACTS, TrustedContact } from '../../types/profile';

type Props = {
  contacts: TrustedContact[];
  onChange: (contacts: TrustedContact[]) => void;
  /** Omit for the onboarding copy (default); pass null to hide the heading entirely — used when Settings supplies its own section label. */
  title?: string | null;
  subtitle?: string | null;
};

const DEFAULT_TITLE = "Who should know you're okay?";
const DEFAULT_SUBTITLE =
  "Add one or two people you trust. We'll only ever reach out to them if you miss a check-in.";

/**
 * Collects one or two trusted contacts by hand (name + phone number)
 * rather than pulling in the phone's contact list. A real contact
 * picker means a native permission prompt for data nothing in the app
 * uses yet — no Twilio, no backend. This gets the real data model
 * (name + phone, up to two people) in place today; swapping in a
 * native picker later only touches this one screen.
 *
 * Reused as-is in Settings (editing live) as well as onboarding
 * (editing a local draft) — it only knows about `contacts`/`onChange`,
 * not where the data ends up.
 */
export function ContactsStep({
  contacts,
  onChange,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
}: Props) {
  const updateContact = (index: number, patch: Partial<TrustedContact>) => {
    onChange(contacts.map((contact, i) => (i === index ? { ...contact, ...patch } : contact)));
  };

  const addContact = () => {
    onChange([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={[styles.contacts, !title && styles.contactsNoTitle]}>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactBlock}>
            <TextField
              size="compact"
              label="Name"
              value={contact.name}
              onChangeText={(text) => updateContact(index, { name: text })}
              placeholder="Their name"
              returnKeyType="next"
            />
            <TextField
              size="compact"
              label="Phone number"
              value={contact.phone}
              onChangeText={(text) => updateContact(index, { phone: text })}
              placeholder="Their phone number"
              keyboardType="phone-pad"
              returnKeyType="done"
            />
            {index > 0 ? (
              <Pressable onPress={() => removeContact(index)} hitSlop={8} style={styles.removeLink}>
                <Text style={styles.removeText}>Remove this contact</Text>
              </Pressable>
            ) : null}
          </View>
        ))}

        {contacts.length < MAX_TRUSTED_CONTACTS ? (
          <Pressable onPress={addContact} style={styles.addRow}>
            <Text style={styles.addText}>+ Add another contact</Text>
          </Pressable>
        ) : null}
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
  contacts: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  contactsNoTitle: {
    marginTop: 0,
  },
  contactBlock: {
    gap: spacing.md,
  },
  removeLink: {
    alignSelf: 'flex-start',
  },
  removeText: {
    ...typography.caption,
    color: colors.inkMuted,
    textDecorationLine: 'underline',
  },
  addRow: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderStyle: 'dashed',
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    ...typography.body,
    color: colors.inkMuted,
    fontWeight: '500',
  },
});
