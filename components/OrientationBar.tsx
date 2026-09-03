import { ReactNode } from "react";

interface OrientationItem {
  label: string;
  content: ReactNode;
}

/**
 * Renders the four questions the product should always answer:
 * Where am I? / What have I accomplished? / What is blocking me? / What
 * should I do next? Used at the top of every stage page so orientation is
 * never more than a glance away.
 */
export default function OrientationBar({
  where,
  accomplished,
  blocking,
  next,
}: {
  where: ReactNode;
  accomplished: ReactNode;
  blocking: ReactNode;
  next: ReactNode;
}) {
  const items: OrientationItem[] = [
    { label: "Where am I?", content: where },
    { label: "What have I accomplished?", content: accomplished },
    { label: "What's blocking me?", content: blocking },
    { label: "What should I do next?", content: next },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100 border border-ink-100 rounded-2xl overflow-hidden">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-4 py-3.5">
          <p className="text-[10.5px] uppercase tracking-wide text-ink-400 font-medium mb-1">{item.label}</p>
          <div className="text-[13px] text-ink-800 leading-snug">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
