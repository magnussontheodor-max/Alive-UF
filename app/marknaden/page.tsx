"use client";

import { Eyebrow, Marke, PageTitle, Panel, PanelHead, SourceChip } from "@/components/ui";
import {
  companies,
  competitionVerdict,
  competitorSource,
  competitors,
  contactState,
  marketHeadline,
  segment,
  sizeDistribution,
} from "@/data/market";
import type { ContactStatus } from "@/data/types";

const statusText: Record<ContactStatus, string> = {
  svarat: "Svarat",
  kontaktad: "Kontaktad",
  "ej-kontaktad": "Ej kontaktad",
};

const statusTon: Record<ContactStatus, "ok" | "slab" | "dim"> = {
  svarat: "ok",
  kontaktad: "slab",
  "ej-kontaktad": "dim",
};

export default function Marknaden() {
  const max = Math.max(...sizeDistribution.map((d) => d.antal));

  return (
    <div className="space-y-5">
      <PageTitle
        eyebrow="Marknaden · registerdata"
        titel={segment.namn}
        ingress="Varje siffra på den här skärmen är hämtad ur registret, inte uppskattad. Sverige har fullständig, offentlig företagsdata — det är därför Spark kan säga saker som ingen internationell aktör kan säga om någon marknad som helst."
      />

      <div className="grid gap-px bg-linesoft sm:grid-cols-2 lg:grid-cols-4">
        {marketHeadline.map((h) => (
          <div key={h.enhet} className="rise bg-panel/55 px-5 py-5">
            <div className="text-[length:var(--fs-30)] font-bold leading-none tabular-nums text-bone">
              {h.varde}
            </div>
            <div className="mt-2 text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-tight)] text-slab">
              {h.enhet}
            </div>
            <p className="mt-2.5 text-[length:var(--fs-11-5)] leading-[var(--lh-tight)] text-dim">{h.beskrivning}</p>
            <div className="mt-3.5">
              <SourceChip kalla={h.kalla} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="rise">
          <PanelHead
            titel="Storleksfördelning"
            hoger={
              <span className="text-[length:var(--fs-10)] text-dim">{segment.sni}</span>
            }
          />
          <div className="px-5 py-5">
            <div className="space-y-3.5">
              {sizeDistribution.map((d) => (
                <div key={d.spann} className="grid grid-cols-[124px_minmax(0,1fr)_auto] items-center gap-3.5">
                  <span className="text-[length:var(--fs-11-5)] text-body">{d.spann}</span>
                  <div className="h-[13px] w-full bg-page/60">
                    <div
                      className="h-full bg-slab/85 transition-[width] duration-700"
                      style={{ width: `${(d.antal / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-[86px] text-right text-[length:var(--fs-11-5)] tabular-nums text-dim">
                    <span className="text-bone">{d.antal}</span> · {d.medianOms}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[74ch] border-l-2 border-slab/45 pl-3.5 text-[length:var(--fs-12)] leading-[var(--lh-relaxed)] text-body">
              197 av 312 har färre än 11 anställda. Det är den halvan som avvisade idén i
              samtalen, och den halvan som drar ner medianomsättningen. Det är också därför
              Spark föreslår att du snävar kundprofilen.
            </p>
            <div className="mt-4">
              <SourceChip kalla={{ origin: "allabolag, 312 bolag", date: "14 september 2026" }} />
            </div>
          </div>
        </Panel>

        <Panel className="rise">
          <PanelHead titel="Dina utskick" />
          <div className="px-5 py-5">
            <dl className="space-y-3.5">
              {[
                ["I registret", `${contactState.totalt} företag`],
                ["Kontaktade", `${contactState.kontaktade} företag`],
                ["Svar", `${contactState.svar} företag`],
                ["Okontaktade", `${contactState.okontaktade} företag`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-linesoft pb-2.5 last:border-b-0">
                  <dt className="text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-tight)] text-dim">{k}</dt>
                  <dd className="text-[length:var(--fs-13)] tabular-nums text-bone">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border border-line bg-page/40 px-3.5 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-tight)] text-dim">
                  Svarsfrekvens
                </span>
                <span className="text-[length:var(--fs-19)] font-bold tabular-nums text-ok">
                  {contactState.svarsfrekvens}
                </span>
              </div>
              <p className="mt-2 text-[length:var(--fs-11-5)] leading-[var(--lh-body)] text-body">
                Normalt i den här branschen är {contactState.benchmark}. Ditt språk
                fungerar — det är underlagets storlek som är problemet, inte mejlet.
              </p>
              <div className="mt-3">
                <SourceChip kalla={contactState.benchmarkKalla} />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="rise">
        <PanelHead
          titel="Kundlistan · namngivna företag ur registret"
          hoger={
            <span className="text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label-tight)] text-dim">
              Demonstrationsdata
            </span>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {["Företag", "Ort", "Omsättning", "Anställda", "Status", "Senast"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-2.5 text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label)] text-dim"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr
                  key={c.namn}
                  className="border-b border-linesoft transition-colors duration-150 last:border-b-0 hover:bg-panel/40"
                >
                  <td className="px-5 py-3 text-[length:var(--fs-12-5)] text-bone">{c.namn}</td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] text-body">{c.ort}</td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] tabular-nums text-body">
                    {c.omsattning}
                  </td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] tabular-nums text-body">
                    {c.anstallda}
                  </td>
                  <td className="px-5 py-3">
                    <Marke ton={statusTon[c.status]}>{statusText[c.status]}</Marke>
                  </td>
                  <td className="px-5 py-3 text-[length:var(--fs-11)] text-dim">{c.notering ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
          <span className="text-[length:var(--fs-11)] text-dim">
            10 av 312 träffar visas. Resten finns i listan med kontaktuppgifter.
          </span>
          <SourceChip
            kalla={{ origin: "Bolagsverket och allabolag", date: "14 september 2026" }}
          />
        </div>
      </Panel>

      <Panel className="rise">
        <PanelHead titel="Vem som redan finns där" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {["Leverantör", "Vad de är", "Prisnivå", "Täcker"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-2.5 text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label)] text-dim"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitors.map((k) => (
                <tr key={k.namn} className="border-b border-linesoft last:border-b-0">
                  <td className="px-5 py-3 text-[length:var(--fs-12-5)] text-bone">{k.namn}</td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] text-body">{k.beskrivning}</td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] tabular-nums text-body">{k.prisniva}</td>
                  <td className="px-5 py-3 text-[length:var(--fs-12)] text-dim">{k.tacker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-5 py-4">
          <Eyebrow>Luckan</Eyebrow>
          <p className="mt-2 max-w-[80ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
            {competitionVerdict}
          </p>
          <div className="mt-3">
            <SourceChip kalla={competitorSource} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
