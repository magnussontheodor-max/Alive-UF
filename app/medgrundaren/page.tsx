"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, Quote, Wrench } from "lucide-react";
import { useTypewriter } from "@/components/Stream";
import { ChipRow, Eyebrow, Marke, PageTitle, Panel, PanelHead } from "@/components/ui";
import { useDemo } from "@/components/DemoState";
import { profile } from "@/data/founder";
import {
  exchanges,
  fallback,
  opening,
  prompts,
  type Block,
  type CofounderReply,
} from "@/data/conversation";

type Item =
  | { roll: "elin"; id: string; text: string }
  | { roll: "co"; id: string; svar: CofounderReply; animera: boolean };

/* ——— Ett block i medgrundarens svar ——— */
function BlockView({
  block,
  animera,
  onKlar,
}: {
  block: Block;
  animera: boolean;
  onKlar: () => void;
}) {
  const text =
    block.typ === "text" ? block.text : block.typ === "citat" ? block.text : "";
  const { visat, klar } = useTypewriter(text, { aktiv: animera && text.length > 0 });

  useEffect(() => {
    if (text.length > 0) {
      if (klar) onKlar();
      return;
    }
    const t = window.setTimeout(onKlar, animera ? 340 : 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klar, text.length, animera]);

  if (block.typ === "text") {
    return (
      <p className="max-w-[68ch] text-[13.5px] leading-[1.7] text-body">
        {visat}
        {animera && !klar ? <span className="caret" /> : null}
      </p>
    );
  }

  if (block.typ === "citat") {
    return (
      <figure className="fade max-w-[68ch] border-l-2 border-slab/45 bg-page/40 py-3 pl-4 pr-3">
        <Quote size={11} strokeWidth={2.4} className="mb-2 text-slab" />
        <blockquote className="text-[13px] leading-[1.7] text-bone italic">
          {visat}
          {animera && !klar ? <span className="caret" /> : null}
        </blockquote>
        <figcaption className="mt-2.5 text-[10.5px] text-dim">{block.av}</figcaption>
      </figure>
    );
  }

  if (block.typ === "punkter") {
    return (
      <ul className="max-w-[68ch] space-y-2">
        {block.punkter.map((p, i) => (
          <li
            key={i}
            className="rise flex gap-3 border border-linesoft bg-page/40 px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-body"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="mt-[9px] h-px w-3 shrink-0 bg-slab" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="rise max-w-[68ch] border border-slab/40 bg-slab/[0.07] px-4 py-3.5">
      <div className="flex items-center gap-2 text-slab">
        <Wrench size={12} strokeWidth={2.3} />
        <span className="text-[10px] label-caps tracking-[0.14em]">{block.rubrik}</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {block.rader.map((r, i) => (
          <li key={i} className="text-[12px] leading-[1.6] text-body">
            {r}
          </li>
        ))}
      </ul>
      {block.lank ? (
        <Link
          href={block.lank}
          className="mt-3.5 inline-flex items-center gap-2 text-[10.5px] label-caps tracking-[0.12em] text-slab transition-opacity hover:opacity-75"
        >
          {block.lankText} <ArrowRight size={11} strokeWidth={2.4} />
        </Link>
      ) : null}
    </div>
  );
}

function CoMessage({
  svar,
  animera,
  onVaxer,
}: {
  svar: CofounderReply;
  animera: boolean;
  /** Anropas varje gång ett nytt block dyker upp, så vyn kan följa med ner. */
  onVaxer: () => void;
}) {
  const [idx, setIdx] = useState(animera ? 0 : svar.block.length);

  useEffect(() => {
    onVaxer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <div className="flex gap-3.5">
      <div className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center border border-slab/45 text-[9px] font-bold tracking-[0.06em] text-slab">
        M
      </div>
      <div className="min-w-0 flex-1 space-y-3.5">
        {svar.block.slice(0, idx + 1).map((b, i) => (
          <BlockView
            key={`${svar.id}-${i}`}
            block={b}
            animera={animera && i === idx}
            onKlar={() => setIdx((v) => (v === i ? v + 1 : v))}
          />
        ))}
        {idx >= svar.block.length ? (
          <div className="fade pt-0.5">
            <ChipRow kallor={svar.chips} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ——— Minnet: de tre lagren medgrundaren läser inför varje svar ——— */
function Minnet() {
  const { notes, trail } = useDemo();
  const uppgifter = profile.reduce((s, b) => s + b.rader.length, 0);
  const anvanda = notes.filter((n) => n.anvand).length;

  const lager = [
    {
      namn: "Profilen",
      undertext: "Vem du är. Byggd genom samtal, inte formulär.",
      matt: `${profile.length} block · ${uppgifter} fastställda uppgifter`,
      lank: "/profilen",
    },
    {
      namn: "Hjärnan",
      undertext: "Ditt eget utrymme. Spark läser men städar aldrig.",
      matt: `${notes.length} anteckningar · ${anvanda} använda i resonemanget`,
      lank: "/hjarnan",
    },
    {
      namn: "Spåret",
      undertext: "Allt som händer. Skrivs av verktygen, aldrig av dig.",
      matt: `${trail.length + 61} händelser sedan 2 september`,
      lank: "/",
    },
  ];

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHead titel="Minnet" />
        <ul>
          {lager.map((l) => (
            <li key={l.namn} className="border-b border-linesoft last:border-b-0">
              <Link
                href={l.lank}
                className="block px-4 py-3.5 transition-colors duration-200 hover:bg-panel/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] label-caps tracking-[0.12em] text-bone">
                    {l.namn}
                  </span>
                  <ArrowRight size={11} strokeWidth={2.4} className="text-dim" />
                </div>
                <p className="mt-1.5 text-[11.5px] leading-[1.55] text-dim">{l.undertext}</p>
                <p className="mt-2 text-[11px] text-slab">{l.matt}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-linesoft px-4 py-3">
          <p className="text-[10.5px] leading-[1.6] text-dim">
            Hela minnet läses inför varje svar. Det är därför medgrundaren kan säga emot
            dig utan att fråga om bakgrunden igen.
          </p>
        </div>
      </Panel>

      <Panel>
        <PanelHead titel="Tonen" />
        <div className="px-4 py-4">
          <p className="text-[11.5px] leading-[1.65] text-body">
            Svensk och rak, ingen peppning. En medgrundare som håller med om allt är
            värdelös — den ska döda svaga idéer i stället för att låta dig lägga månader
            på fel sak.
          </p>
        </div>
      </Panel>
    </div>
  );
}

export default function Medgrundaren() {
  const [items, setItems] = useState<Item[]>([
    { roll: "co", id: "start", svar: opening, animera: false },
  ]);
  const [forslag, setForslag] = useState<string[]>(prompts);
  const [utkast, setUtkast] = useState("");
  const [vantar, setVantar] = useState(false);
  const botten = useRef<HTMLDivElement>(null);
  const raknare = useRef(0);

  const tillBotten = useCallback(() => {
    botten.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    tillBotten();
  }, [items, vantar, tillBotten]);

  const svaraPa = (fraga: string) => {
    if (vantar) return;
    const n = raknare.current++;
    setItems((prev) => [...prev, { roll: "elin", id: `e-${n}`, text: fraga }]);
    setVantar(true);

    const normaliserad = fraga.toLowerCase();
    const traff =
      exchanges.find((e) => e.fraga.toLowerCase() === normaliserad) ??
      exchanges.find((e) => e.nyckelord.some((k) => normaliserad.includes(k)));
    const svar = traff?.svar ?? fallback;

    window.setTimeout(() => {
      setVantar(false);
      setItems((prev) => [...prev, { roll: "co", id: `c-${n}`, svar, animera: true }]);
      setForslag(
        svar.foljdfragor && svar.foljdfragor.length > 0
          ? svar.foljdfragor
          : prompts.filter((p) => p.toLowerCase() !== normaliserad).slice(0, 3),
      );
    }, 620);
  };

  const skicka = () => {
    const t = utkast.trim();
    if (!t) return;
    setUtkast("");
    svaraPa(t);
  };

  const kvarvarande = useMemo(
    () => forslag.filter((f) => !items.some((i) => i.roll === "elin" && i.text === f)),
    [forslag, items],
  );

  return (
    <div>
      <PageTitle
        eyebrow="Medgrundaren"
        titel="Samtalet"
        ingress="Samma medgrundare varje gång. Läser hela minnet inför varje svar, säger rakt ut vad den tycker och avslutar med att ett verktyg körs — aldrig bara ett svar."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="flex min-w-0 flex-col border border-line bg-panel/40 rounded-[3px]">
        <div className="flex items-center justify-between gap-3 border-b border-linesoft px-5 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="pulsedot h-1.5 w-1.5 rounded-full bg-ok" />
            <span className="text-[10px] label-caps tracking-[0.14em] text-dim">
              Läser profilen, hjärnan och spåret
            </span>
          </div>
          <Marke ton="slab">Steg 05 · Samtalen</Marke>
        </div>

        <div className="max-h-[min(62vh,640px)] min-h-[380px] space-y-7 overflow-y-auto px-5 py-6">
          {items.map((i) =>
            i.roll === "elin" ? (
              <div key={i.id} className="rise flex justify-end">
                <div className="max-w-[54ch] border border-line bg-[#2F353D] px-3.5 py-2.5">
                  <div className="mb-1 text-right text-[9px] label-caps tracking-[0.14em] text-dim">
                    Elin
                  </div>
                  <p className="text-[13px] leading-[1.6] text-bone">{i.text}</p>
                </div>
              </div>
            ) : (
              <CoMessage
                key={i.id}
                svar={i.svar}
                animera={i.animera}
                onVaxer={tillBotten}
              />
            ),
          )}

          {vantar ? (
            <div className="fade flex gap-3.5">
              <div className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center border border-slab/45 text-[9px] font-bold text-slab">
                M
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="pulsedot h-1 w-1 rounded-full bg-slab"
                    style={{ animationDelay: `${d * 180}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div ref={botten} />
        </div>

        <div className="border-t border-linesoft px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {kvarvarande.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => svaraPa(f)}
                disabled={vantar}
                className="border border-line px-3 py-1.5 text-[11.5px] text-body transition-colors duration-200 hover:border-slab/60 hover:text-bone disabled:opacity-40 rounded-[3px]"
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-line bg-page/50 px-3 py-2 rounded-[3px] focus-within:border-slab/50">
            <input
              value={utkast}
              onChange={(e) => setUtkast(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") skicka();
              }}
              placeholder="Skriv till din medgrundare"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-bone outline-none placeholder:text-dim"
            />
            <button
              type="button"
              onClick={skicka}
              disabled={vantar || utkast.trim().length === 0}
              className="flex items-center gap-1.5 text-[10px] label-caps tracking-[0.12em] text-dim transition-colors hover:text-slab disabled:opacity-40"
            >
              Skicka <CornerDownLeft size={11} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        </div>

        <Minnet />
      </div>

      <div className="mt-4 text-[11px] leading-relaxed text-dim">
        <Eyebrow>Regeln</Eyebrow>
        <span className="mt-1.5 block max-w-[72ch]">
          Varje samtal slutar med att ett verktyg körs eller att du har en konkret
          uppgift i verkligheten.
        </span>
      </div>
    </div>
  );
}
