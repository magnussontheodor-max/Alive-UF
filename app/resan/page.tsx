"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Lock, Loader } from "lucide-react";
import { Eyebrow, Marke, PageTitle, Panel } from "@/components/ui";
import { phases, steps, type Step } from "@/data/journey";

function StatusMarke({ status }: { status: Step["status"] }) {
  if (status === "klar")
    return (
      <Marke ton="ok">
        <Check size={9} strokeWidth={3} /> Klart
      </Marke>
    );
  if (status === "pågår")
    return (
      <Marke ton="slab">
        <Loader size={9} strokeWidth={2.6} /> Pågår
      </Marke>
    );
  return (
    <Marke ton="dim">
      <Lock size={9} strokeWidth={2.6} /> Låst
    </Marke>
  );
}

function StegRad({ steg, forst }: { steg: Step; forst: boolean }) {
  const [oppet, setOppet] = useState(forst);
  const last = steg.status === "låst";

  return (
    <li className="border-b border-linesoft last:border-b-0">
      <button
        type="button"
        onClick={() => setOppet((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-panel/40"
      >
        <span
          className={`w-8 shrink-0 text-[length:var(--fs-17)] font-bold tabular-nums ${
            last ? "text-dim" : "text-slab"
          }`}
        >
          {steg.nr}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[length:var(--fs-13-5)] label-caps tracking-[var(--track-label-tight)] ${
              last ? "text-dim" : "text-bone"
            }`}
          >
            {steg.namn}
          </span>
          <span className="mt-1 block truncate text-[length:var(--fs-11-5)] text-dim">{steg.kort}</span>
        </span>
        <span className="hidden shrink-0 text-right sm:block">
          <span className="block text-[length:var(--fs-11)] tabular-nums text-body">
            {steg.maxPoang === 0
              ? "inga poäng"
              : steg.fickPoang !== undefined
                ? `${steg.fickPoang} av ${steg.maxPoang} p`
                : `upp till ${steg.maxPoang} p`}
          </span>
          {steg.datum ? (
            <span className="mt-0.5 block text-[length:var(--fs-10)] text-dim">{steg.datum}</span>
          ) : null}
        </span>
        <StatusMarke status={steg.status} />
        <ChevronDown
          size={13}
          strokeWidth={2.2}
          className={`shrink-0 text-dim transition-transform duration-200 ${
            oppet ? "rotate-180" : ""
          }`}
        />
      </button>

      {oppet ? (
        <div className="expand px-5 pb-5 sm:pl-[68px]">
          {last ? (
            <div className="border border-dashed border-line bg-page/35 px-4 py-3.5">
              <Eyebrow>Vad som krävs</Eyebrow>
              <p className="mt-2 max-w-[74ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
                {steg.kravs}
              </p>
              <p className="mt-2.5 text-[length:var(--fs-11)] text-dim">
                Kan ge upp till {steg.maxPoang} poäng när det låses upp.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Eyebrow>Vad som gjordes</Eyebrow>
                <ul className="mt-2.5 space-y-2">
                  {steg.gjordes?.map((g, i) => (
                    <li key={i} className="flex gap-2.5 text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body">
                      <Check size={11} strokeWidth={2.6} className="mt-[4px] shrink-0 text-ok" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Eyebrow>Vad som kom ut</Eyebrow>
                <dl className="mt-2.5 space-y-2.5">
                  {steg.resultat?.map((r) => (
                    <div key={r.etikett} className="border-l border-line pl-3">
                      <dt className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-tight)] text-dim">
                        {r.etikett}
                      </dt>
                      <dd className="mt-1 text-[length:var(--fs-12-5)] leading-[var(--lh-tight)] text-bone">
                        {r.varde}
                      </dd>
                    </div>
                  ))}
                </dl>
                {steg.lank ? (
                  <Link
                    href={steg.lank}
                    className="mt-3.5 inline-flex items-center gap-2 text-[length:var(--fs-10-5)] label-caps tracking-[var(--track-label)] text-slab transition-opacity hover:opacity-75"
                  >
                    {steg.lankText} <ArrowRight size={11} strokeWidth={2.4} />
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </li>
  );
}

export default function Resan() {
  return (
    <div>
      <PageTitle
        eyebrow="Resan"
        titel="Tolv steg i fyra faser"
        ingress="Ett handlingssteg i taget. Avslutas det låses nästa upp. Låsmekaniken finns för att hindra att du bygger innan valideringen är gjord — det är exakt det misstag produkten finns för att förhindra."
      />

      <div className="space-y-5">
        {phases.map((fas) => {
          const ifas = steps.filter((s) => s.fas === fas.namn);
          const klara = ifas.filter((s) => s.status === "klar").length;
          return (
            <Panel key={fas.namn} className="rise">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-[length:var(--fs-14)] label-caps tracking-[var(--track-label-wide)] text-bone">
                    {fas.namn}
                  </h2>
                  <span className="text-[length:var(--fs-10-5)] text-dim">Steg {fas.steg}</span>
                </div>
                <div className="flex items-center gap-3 text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-tight)] text-dim">
                  <span>
                    {klara} av {ifas.length} klara
                  </span>
                  <span className="h-3 w-px bg-line" />
                  <span>Tak {fas.tak} poäng</span>
                </div>
              </div>
              <ul>
                {ifas.map((s) => (
                  <StegRad key={s.nr} steg={s} forst={s.nr === "05"} />
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
