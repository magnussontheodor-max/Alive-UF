export type SubjectMode = 'self' | 'other';

export type TrustedContact = {
  /** Unset for a contact not yet saved to the backend (a fresh row in an onboarding draft). */
  id?: string;
  name: string;
  phone: string;
  /** Set once this contact has been saved — used to build the shareable invite link (see ContactsStep / ARCHITECTURE.md). */
  inviteToken?: string;
  /** 'linked' once the contact has opened the invite and signed in as themselves. */
  status?: 'pending' | 'linked';
};

/** ALIVE supports up to two trusted contacts for now — enough for "a partner and a parent" without turning onboarding into a contact list. */
export const MAX_TRUSTED_CONTACTS = 2;

/**
 * A precise daily check-in deadline, e.g. `{ hour: 10, minute: 0 }` =
 * "check in by 10:00" — chosen on a scroll wheel in 15-minute steps.
 * Replaces the earlier three fixed presets (morning/afternoon/evening):
 * a specific time fits how someone actually structures their day better
 * than picking a four-hour block, and it's still a single quick
 * interaction, not a form.
 */
export type CheckInWindow = {
  /** 24h clock. */
  hour: number;
  /** 0/15/30/45. */
  minute: number;
};

export const DEFAULT_CHECK_IN_WINDOW: CheckInWindow = { hour: 10, minute: 0 };

export type GraceOption = {
  id: string;
  label: string;
  minutes: number;
  description: string;
};

/**
 * How long ALIVE waits after a missed check-in before telling trusted
 * contacts — chosen during onboarding rather than fixed for everyone.
 * A fast-paced day and a slow one warrant different amounts of grace,
 * and it's the one part of the escalation timeline that's really a
 * judgment call, not a platform default.
 */
export const GRACE_OPTIONS: GraceOption[] = [
  { id: '30m', label: '30 minutes', minutes: 30, description: 'Tell them quickly if something seems off.' },
  { id: '1h', label: '1 hour', minutes: 60, description: 'A reasonable default for most days.' },
  { id: '3h', label: '3 hours', minutes: 180, description: 'More room before anyone else is involved.' },
];

export const DEFAULT_GRACE_MINUTES = 60;

/**
 * The escalation timeline, in minutes relative to the check-in
 * deadline: a reminder 30 minutes before it, and — if still nothing —
 * trusted contacts are informed however long the grace period the user
 * chose (`GRACE_OPTIONS`) says, after it. Only the lead-in reminder
 * stays fixed; the wait before contacts hear anything is a per-user
 * setting now.
 */
export const ESCALATION = {
  reminderBeforeCloseMin: 30,
} as const;
