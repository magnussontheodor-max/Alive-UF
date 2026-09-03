export default function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="px-6 md:px-8 py-7 max-w-6xl mx-auto space-y-7 animate-fadeIn">{children}</div>;
}
