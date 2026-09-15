"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useDemo } from "@/components/DemoState";
import { Knapp, PageTitle, Panel } from "@/components/ui";

export default function Hjarnan() {
  const { notes, addNote } = useDemo();
  const [utkast, setUtkast] = useState("");

  const spara = () => {
    const t = utkast.trim();
    if (!t) return;
    addNote(t);
    setUtkast("");
  };

  const anvanda = notes.filter((n) => n.anvand).length;

  return (
    <div>
      <PageTitle
        eyebrow="Hjärnan"
        titel="Ditt eget utrymme"
        ingress="Tankar, irritationer, halvfärdiga idéer. Ostrukturerat och frivilligt. Spark läser men städar aldrig — och markerar diskret vad medgrundaren faktiskt använt i sitt resonemang."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 text-[length:var(--fs-11)] text-dim">
        <span>{notes.length} anteckningar</span>
        <span className="h-3 w-px bg-line" />
        <span className="flex items-center gap-1.5 text-slab">
          <Sparkles size={11} strokeWidth={2.3} />
          {anvanda} har använts i resonemanget
        </span>
      </div>

      <Panel className="rise mb-5">
        <div className="px-4 py-4">
          <textarea
            value={utkast}
            onChange={(e) => setUtkast(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) spara();
            }}
            rows={2}
            placeholder="Skriv ner det innan du glömmer det"
            className="w-full resize-none bg-transparent text-[length:var(--fs-13)] leading-[var(--lh-body)] text-bone outline-none placeholder:text-dim"
          />
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-linesoft pt-3">
            <span className="text-[length:var(--fs-10)] text-dim">
              Inget format, ingen kategori, ingen påminnelse
            </span>
            <Knapp variant="primar" onClick={spara} disabled={utkast.trim().length === 0}>
              <Plus size={12} strokeWidth={2.6} /> Lägg till
            </Knapp>
          </div>
        </div>
      </Panel>

      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {notes.map((n) => (
          <article
            key={n.id}
            className="rise mb-4 break-inside-avoid border border-line bg-panel/55 rounded-[var(--radius)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-linesoft px-4 py-2.5">
              <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
                {n.datum}
              </span>
              {n.anvand ? (
                <span className="flex items-center gap-1.5 text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label-tight)] text-slab">
                  <Sparkles size={9} strokeWidth={2.4} />
                  {n.anvand}
                </span>
              ) : null}
            </div>
            <p className="px-4 py-4 text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">{n.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
