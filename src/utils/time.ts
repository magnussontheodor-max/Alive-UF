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

/**
 * Describes when the next check-in window opens. This is a simple demo
 * placeholder — the real version will depend on the user's chosen
 * check-in window and time zone.
 */
export function nextCheckInLabel(): string {
  return 'Tomorrow morning';
}
