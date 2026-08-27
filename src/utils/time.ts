import type { CheckInWindow } from '../types/profile';

/** Time-of-day-aware greeting: "Good morning" / "Good afternoon" / "Good evening". */
export function greetingForHour(hour: number): string {
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Formats today's date as "Tuesday · 25 August", for the small eyebrow label. */
export function formatDateLabel(date: Date): string {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  return `${weekday} · ${day} ${month}`;
}

/** Formats a time as 24-hour "HH:MM", the convention used in Sweden. */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Formats a check-in deadline as 24-hour "HH:MM". */
export function formatWindowTime(window: CheckInWindow): string {
  return `${window.hour.toString().padStart(2, '0')}:${window.minute.toString().padStart(2, '0')}`;
}

/**
 * Describes when the next check-in deadline is, based on the time
 * chosen during onboarding. Always says "tomorrow" — once a real
 * schedule exists, this should say "today" if the deadline hasn't
 * passed yet and the user hasn't checked in.
 */
export function nextCheckInLabel(window: CheckInWindow): string {
  return `Tomorrow at ${formatWindowTime(window)}`;
}
