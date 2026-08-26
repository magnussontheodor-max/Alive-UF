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
  /** 24h clock. Used to compute the closing-soon/missed/escalated states, not just for display. */
  startHour: number;
  endHour: number;
};

/**
 * Three fixed windows rather than a free time picker — keeps onboarding
 * a single tap instead of a dial/scroll interaction, in line with
 * "extremely simple, minimal cognitive load". A precise custom time can
 * replace this later without changing anything that reads
 * `checkInWindow`.
 */
export const CHECK_IN_WINDOW_OPTIONS: CheckInWindowOption[] = [
  { id: 'morning', label: 'Morning', hours: '7:00–11:00', startHour: 7, endHour: 11 },
  { id: 'afternoon', label: 'Afternoon', hours: '12:00–16:00', startHour: 12, endHour: 16 },
  { id: 'evening', label: 'Evening', hours: '17:00–21:00', startHour: 17, endHour: 21 },
];

export function windowOption(window: CheckInWindow): CheckInWindowOption {
  const option = CHECK_IN_WINDOW_OPTIONS.find((o) => o.id === window);
  if (!option) throw new Error(`Unknown check-in window: ${window}`);
  return option;
}

/**
 * The escalation timeline, in minutes relative to the window closing:
 * a reminder 30 minutes before it closes, another 30 minutes after it
 * closes, and — if still nothing — trusted contacts are informed 30
 * minutes after that (a full hour of grace after the window closes).
 * One fixed cadence for now rather than a per-user setting; see
 * ARCHITECTURE.md.
 */
export const ESCALATION = {
  reminderBeforeCloseMin: 30,
  reminderAfterCloseMin: 30,
  escalateAfterCloseMin: 60,
} as const;
