import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

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
 *
 * A contact only gets an `inviteToken` once it's actually been saved
 * (ProfileContext.setContacts assigns one server-side on insert), so
 * the invite row below only ever appears in Settings, never mid-
 * onboarding where these are still unsaved drafts — no special-casing
 * needed, the data just isn't there yet at that point.
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

  const sendInvite = async (contact: TrustedContact) => {
    if (!contact.inviteToken) return;
    const url = Linking.createURL(`join/${contact.inviteToken}`);
    try {
      await Share.share({
        message: `I'm using ALIVE to let people know I'm okay each day. Open this on your phone so I can add you as someone to notify: ${url}`,
      });
    } catch {
      // The share sheet can be dismissed or fail silently on some
      // platforms — nothing to recover from, just nothing sent.
    }
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
            {contact.inviteToken ? (
              contact.status === 'linked' ? (
                <Text style={styles.linkedNote}>Connected — they'll be notified if you miss a check-in.</Text>
              ) : (
                <Pressable onPress={() => sendInvite(contact)} hitSlop={8} style={styles.inviteLink}>
                  <Text style={styles.inviteLinkText}>Send them an invite link</Text>
                </Pressable>
              )
            ) : null}
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
  inviteLink: {
    alignSelf: 'flex-start',
  },
  inviteLinkText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkedNote: {
    ...typography.caption,
    color: colors.inkMuted,
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
