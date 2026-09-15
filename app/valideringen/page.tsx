"use client";

import { Check, CircleSlash, HelpCircle, Quote } from "lucide-react";
import { Eyebrow, Marke, PageTitle, Panel, PanelHead, SourceChip } from "@/components/ui";
import {
  assumptions,
  outreach,
  outreachSource,
  priceEvidence,
  replies,
  stanceLabel,
  verdict,
} from "@/data/validation";
import type { AnswerStance, AssumptionStatus } from "@/data/types";

const statusIkon = {
  bekräftat: Check,
  motsagt: CircleSlash,
  obesvarat: HelpCircle,
};

const statusTon: Record<AssumptionStatus, "ok" | "bad" | "warn"> = {
  bekräftat: "ok",
  motsagt: "bad",
  obesvarat: "warn",
};

const stanceTon: Record<AnswerStance, "ok" | "bad" | "warn"> = {
  bekräftar: "ok",
  avvisar: "bad",
  delvis: "warn",
};

export default function Valideringen() {
  return (
    <div className="space-y-5">
      <PageTitle
        eyebrow="Valideringen · bevisen"
        titel="Sex svar från namngivna personer"
        ingress="Spark byggde kontaktlistan ur registret, skrev mejlen och skickade dem från Elins egen adress. Det här är vad som kom tillbaka — ordagrant, med avsändare och datum. Efterfrågan bevisas av personer som svarat, inte av en enkät eller en modells bedömning."
      />

      <div className="grid gap-px bg-linesoft sm:grid-cols-2 lg:grid-cols-4">
        {[
          { v: String(outreach.kontaktade), e: "kontaktade", b: outreach.period },
          { v: String(outreach.svar), e: "svar", b: "samtliga lästa och nedbrutna" },
          { v: outreach.svarsfrekvens, e: "svarsfrekvens", b: "på 47 utskick" },
          {
            v: outreach.benchmark,
            e: "branschens normalvärde",
            b: "Sparks egen data, 214 körningar",
          },
        ].map((k) => (
          <div key={k.e} className="rise bg-panel/55 px-5 py-5">
            <div className="text-[length:var(--fs-30)] font-bold leading-none tabular-nums text-bone">
              {k.v}
            </div>
            <div className="mt-2 text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-tight)] text-slab">
              {k.e}
            </div>
            <p className="mt-2.5 text-[length:var(--fs-11-5)] leading-[var(--lh-tight)] text-dim">{k.b}</p>
          </div>
        ))}
      </div>

      <Panel className="rise">
        <PanelHead
          titel="Utskicket"
          hoger={<SourceChip kalla={outreachSource} />}
        />
        <div className="grid gap-px bg-linesoft sm:grid-cols-3">
          {[
            ["Kanal", outreach.kanal],
            ["Påminnelse", outreach.paminnelse],
            ["Period", outreach.period],
          ].map(([k, v]) => (
            <div key={k} className="bg-panel/55 px-5 py-4">
              <div className="text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label)] text-dim">{k}</div>
              <p className="mt-1.5 text-[length:var(--fs-12)] leading-[var(--lh-tight)] text-body">{v}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="rise">
        <PanelHead titel="Antagandena som prövades" />
        <ul>
          {assumptions.map((a) => {
            const Ikon = statusIkon[a.status];
            const ton = statusTon[a.status];
            return (
              <li key={a.id} className="border-b border-linesoft px-5 py-4 last:border-b-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <Ikon
                      size={14}
                      strokeWidth={2.3}
                      className={`mt-[2px] shrink-0 ${
                        ton === "ok" ? "text-ok" : ton === "bad" ? "text-bad" : "text-warn"
                      }`}
                    />
                    <h3 className="max-w-[70ch] text-[length:var(--fs-13-5)] leading-[var(--lh-tight)] text-bone">
                      {a.text}
                    </h3>
                  </div>
                  <Marke ton={ton}>{a.status}</Marke>
                </div>
                <p className="mt-2.5 max-w-[80ch] pl-[26px] text-[length:var(--fs-12)] leading-[var(--lh-relaxed)] text-body">
                  {a.underlag}
                </p>
                <div className="mt-2.5 pl-[26px]">
                  <SourceChip kalla={a.kalla} />
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <Eyebrow>Svaren · ordagrant</Eyebrow>
          <span className="text-[length:var(--fs-10)] text-dim">
            2 av 6 avvisar. Det är underlaget, inte ett urval.
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {replies.map((r) => (
            <article
              key={r.id}
              className="rise flex flex-col border border-line bg-panel/55 rounded-[var(--radius)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-linesoft px-4 py-3">
                <div className="min-w-0">
                  <h3 className="truncate text-[length:var(--fs-12-5)] font-semibold text-bone">
                    {r.person}
                  </h3>
                  <p className="mt-0.5 truncate text-[length:var(--fs-11)] text-dim">
                    {r.roll} · {r.foretag}
                  </p>
                </div>
                <Marke ton={stanceTon[r.stance]}>{stanceLabel[r.stance]}</Marke>
              </div>
              <div className="flex-1 px-4 py-4">
                <Quote size={11} strokeWidth={2.4} className="mb-2.5 text-slab" />
                <blockquote className="text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
                  {r.citat}
                </blockquote>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-linesoft px-4 py-2.5">
                <span className="text-[length:var(--fs-10-5)] text-dim">
                  {r.ort} · {r.anstallda} anställda · {r.datum}
                </span>
                {r.prisangivelse ? (
                  <span className="text-[length:var(--fs-10-5)] tabular-nums text-slab">
                    Angav {r.prisangivelse} kr/mån
                  </span>
                ) : (
                  <span className="text-[length:var(--fs-10-5)] text-dim">Ingen prisangivelse</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Panel className="rise">
        <PanelHead titel="Prisunderlaget" />
        <div className="px-5 py-5">
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
                Vad kunderna sa
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                {priceEvidence.angivnaPriser.map((p) => (
                  <span
                    key={p}
                    className="border border-ok/40 px-2.5 py-1 text-[length:var(--fs-13)] tabular-nums text-ok rounded-[var(--radius)]"
                  >
                    {p} kr
                  </span>
                ))}
              </div>
              <div className="mt-2.5 text-[length:var(--fs-11)] text-dim">
                Median {priceEvidence.median} kr · 3 av 4 svarande
              </div>
            </div>
            <div className="h-10 w-px bg-line" />
            <div>
              <div className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
                Ditt pris
              </div>
              <div className="mt-2">
                <span className="border border-bad/40 px-2.5 py-1 text-[length:var(--fs-13)] tabular-nums text-bad rounded-[var(--radius)]">
                  {priceEvidence.dittPris} kr
                </span>
              </div>
              <div className="mt-2.5 text-[length:var(--fs-11)] text-bad">
                {priceEvidence.faktor} för högt
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SourceChip kalla={priceEvidence.kalla} />
          </div>
        </div>
      </Panel>

      <Panel className="rise border-warn/35">
        <div className="border-b border-warn/20 px-5 py-2.5">
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-wide)] text-warn">
            Domen · steg 06
          </span>
        </div>
        <div className="px-5 py-6">
          <h2 className="text-[length:var(--fs-34)] font-bold leading-none tracking-[var(--track-head)] text-warn uppercase">
            {verdict.beslut}
          </h2>
          <div className="mt-5 max-w-[74ch] space-y-3">
            <p className="text-[length:var(--fs-14)] leading-[var(--lh-relaxed)] text-bone">{verdict.sammanfattning}</p>
            <p className="text-[length:var(--fs-14)] leading-[var(--lh-relaxed)] text-bone">{verdict.invandning}</p>
          </div>
          <p className="mt-5 border-l-2 border-warn/50 pl-4 text-[length:var(--fs-15)] leading-[var(--lh-body)] text-bone">
            {verdict.atgard}
          </p>
          <p className="mt-4 max-w-[80ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
            {verdict.detalj}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <SourceChip kalla={verdict.kalla} />
            <span className="text-[length:var(--fs-11)] text-dim">{verdict.spärr}</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
