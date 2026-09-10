// Minimal inline icon set — kept local so the prototype has no icon-library
// dependency. Each icon is a plain 20x20 stroke glyph.

export type IconProps = { className?: string };

const base = "1.6";

export function IconGrid({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth={base} />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth={base} />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth={base} />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth={base} />
    </svg>
  );
}

export function IconCompany({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3.5 17V4.2c0-.4.3-.7.7-.7h6.6c.4 0 .7.3.7.7V17" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M11.5 8.5h4.3c.4 0 .7.3.7.7V17" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M6 6.5h1.5M6 9.5h1.5M6 12.5h1.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path d="M13.5 11.5h1.2M13.5 14h1.2" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path d="M2 17h16" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconBulb({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7 15h6M8 17.5h4" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path
        d="M10 2.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2v.5h4V13.5c0-.8.4-1.5 1-2a5 5 0 0 0-3-9Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="8.8" cy="8.8" r="5.3" stroke="currentColor" strokeWidth={base} />
      <path d="M16.5 16.5l-3.6-3.6" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconFlask({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M8 2.5h4M8.5 3v5.2L4.6 14.8c-.6 1 .1 2.2 1.2 2.2h8.4c1.1 0 1.8-1.2 1.2-2.2L11.5 8.2V3" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M6.5 12.5h7" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 2.8l7 3.6-7 3.6-7-3.6 7-3.6Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M3 10.2l7 3.6 7-3.6" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M3 13.8l7 3.6 7-3.6" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
    </svg>
  );
}

export function IconHammer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M11.2 8.2 4.6 14.8a1.4 1.4 0 0 0 2 2l6.6-6.6" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M10.5 7.5l3.2-3.2a3 3 0 0 1 4 4l-3.2 3.2-4-4Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
    </svg>
  );
}

export function IconScale({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 2.8v14.4M6.3 4.6h7.4" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path d="M10 4.6 6 12.6h8L10 4.6Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M4.5 12.6a1.5 2.4 0 1 0 3 0M12.5 12.6a1.5 2.4 0 1 0 3 0" stroke="currentColor" strokeWidth={base} />
      <path d="M7 17.2h6" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconRocket({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10.3 12.6c2.6-2.1 3.7-5.5 3.3-8.9-3.4-.4-6.8.7-8.9 3.3l-2 .5 1.6 1.6-.7 2.6 2.6-.7 1.6 1.6.5-2Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
      <circle cx="11.3" cy="7.7" r="1.1" stroke="currentColor" strokeWidth={base} />
      <path d="M6.2 13.8c-1 .3-1.7 1-2 2.9 1.9-.3 2.6-1 2.9-2" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth={base} />
      <path
        d="M10 3.3v1.6M10 15.1v1.6M16.7 10h-1.6M4.9 10H3.3M14.7 5.3l-1.1 1.1M6.4 13.6l-1.1 1.1M14.7 14.7l-1.1-1.1M6.4 6.4 5.3 5.3"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDot({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5c.4 2.7 1.1 4.3 2.2 5.4 1.1 1.1 2.7 1.8 5.3 2.1-2.6.3-4.2 1-5.3 2.1-1.1 1.1-1.8 2.7-2.2 5.4-.4-2.7-1.1-4.3-2.2-5.4-1.1-1.1-2.7-1.8-5.3-2.1 2.6-.3 4.2-1 5.3-2.1 1.1-1.1 1.8-2.7 2.2-5.4Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6 14 14 6M8 6h6v6" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
