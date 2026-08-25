export type CheckInWindow = 'morning' | 'afternoon' | 'evening';

export type TrustedContact = {
  name: string;
  phone: string;
};

/** ALIVE supports up to two trusted contacts for now — enough for "a partner and a parent" without turning onboarding into a contact list. */
export const MAX_TRUSTED_CONTACTS = 2;

export type CheckInWindowOption = {
  id: CheckInWindow;
  label: string;
  hours: string;
};

/**
 * Three fixed windows rather than a free time picker — keeps onboarding
 * a single tap instead of a dial/scroll interaction, in line with
 * "extremely simple, minimal cognitive load". A precise custom time can
 * replace this later without changing anything that reads
 * `checkInWindow`.
 */
export const CHECK_IN_WINDOW_OPTIONS: CheckInWindowOption[] = [
  { id: 'morning', label: 'Morning', hours: '7:00–11:00' },
  { id: 'afternoon', label: 'Afternoon', hours: '12:00–16:00' },
  { id: 'evening', label: 'Evening', hours: '17:00–21:00' },
];
