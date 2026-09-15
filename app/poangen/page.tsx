"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, Lock, TrendingUp } from "lucide-react";
import { useDemo } from "@/components/DemoState";
import {
  Bar,
  CountUp,
  Eyebrow,
  Knapp,
  Marke,
  PageTitle,
  Panel,
  PanelHead,
  SourceChip,
} from "@/components/ui";
import {
  currentCap,
  gapLabels,
  levelFor,
  phaseCaps,
  scoreParts,
  structuralGap,
  suggestions,
} from "@/data/score";

function Toppen() {
  const { total, previous, sinceLast } = useDemo();
  const niva = levelFor(total);
  const ton = niva.farg === "ok" ? "text-ok" : niva.farg === "warn" ? "text-warn" : "text-bad";

  return (
    <Panel className="rise">
      <div className="grid gap-6 px-5 py-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex items-baseline gap-2">
          <CountUp
            from={previous}
            to={total}
            className={`text-[length:var(--fs-64)] font-bold leading-none tabular-nums ${ton}`}
          />
          <span className="text-[length:var(--fs-17)] text-dim">/ 100</span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Marke ton={niva.farg as "ok" | "warn" | "bad"}>{niva.namn}</Marke>
            <span className="flex items-center gap-1.5 text-[length:var(--fs-11)] text-ok">
              <TrendingUp size={11} strokeWidth={2.4} /> +{sinceLast} sedan måndag
            </span>
          </div>
          <p className="mt-3 max-w-[66ch] text-[length:var(--fs-13)] leading-[var(--lh-relaxed)] text-body">
            Poängen mäter hur mycket som är <span className="text-bone">bevisat</span>,
            inte hur bra idén låter. Den räknas i kod ur strukturerad data — modellen
            läser svaren och drar ut fakta, beräkningen sker i en vanlig funktion. Varje
            poäng har en källa och ett datum. Finns ingen källa ges ingen poäng.
          </p>
          <p className="mt-2.5 max-w-[66ch] text-[length:var(--fs-12)] leading-[var(--lh-relaxed)] text-dim">
            Poängen kan gå ner. Om nya svar motsäger tidigare sjunker den — en siffra som
            bara kan stiga är en lögn.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function Fastak() {
  const { total } = useDemo();
  return (
    <Panel className="rise">
      <PanelHead
        titel="Taken per fas"
        hoger={
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
            Du står på {total} · taket här är {currentCap}
          </span>
        }
      />
      <div className="px-5 py-6">
        <div className="relative h-[3px] w-full bg-linesoft">
          <div
            className="absolute left-0 top-0 h-full bg-slab transition-[width] duration-700"
            style={{ width: `${total}%` }}
          />
          {phaseCaps.map((f) => (
            <span
              key={f.fas}
              className="absolute -top-[5px] h-[13px] w-px bg-line"
              style={{ left: `${f.tak}%` }}
            />
          ))}
          <span
            className="absolute -top-[9px] -ml-[5px] h-[21px] w-[10px] border border-slab bg-page"
            style={{ left: `${total}%` }}
          />
        </div>

        <div className="mt-6 grid gap-px bg-linesoft sm:grid-cols-5">
          {phaseCaps.map((f) => {
            const passerad = total >= f.tak;
            const aktuell = f.tak === currentCap;
            return (
              <div
                key={f.fas}
                className={`bg-panel/55 px-3.5 py-3.5 ${aktuell ? "border-t-2 border-slab" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label-tight)] text-dim">
                    {f.fas}
                  </span>
                  <span
                    className={`text-[length:var(--fs-15)] font-bold tabular-nums ${
                      passerad ? "text-ok" : aktuell ? "text-slab" : "text-dim"
                    }`}
                  >
                    {f.tak}
                  </span>
                </div>
                <div className="mt-1 text-[length:var(--fs-9-5)] text-dim">Steg {f.steg}</div>
                <p className="mt-2.5 text-[length:var(--fs-11)] leading-[var(--lh-tight)] text-body">{f.text}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 max-w-[78ch] border-l-2 border-slab/45 pl-3.5 text-[length:var(--fs-12)] leading-[var(--lh-relaxed)] text-body">
          Den som inte pratat med en enda människa kan aldrig komma över 30. Och 85 eller
          mer betyder att du har betalande kunder — den nivån går inte att nå med en bra
          idé, bara med ett fungerande företag.
        </p>
      </div>
    </Panel>
  );
}

function Del({ nyckel }: { nyckel: string }) {
  const { parts } = useDemo();
  const del = scoreParts.find((p) => p.nyckel === nyckel)!;
  const [oppen, setOppen] = useState(nyckel === "betalningsvilja");
  const poang = parts[del.nyckel];
  const last = Boolean(del.last);
  const andel = (poang / del.max) * 100;
  const ton = andel >= 75 ? "ok" : andel >= 45 ? "warn" : "bad";

  return (
    <div className="border-b border-linesoft last:border-b-0">
      <button
        type="button"
        onClick={() => !last && setOppen((o) => !o)}
        disabled={last}
        className={`flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-200 ${
          last ? "cursor-default opacity-70" : "hover:bg-panel/40"
        }`}
      >
        <div className="w-[136px] shrink-0">
          <div className="flex items-center gap-2 text-[length:var(--fs-12)] label-caps tracking-[var(--track-label-tight)] text-bone">
            {last ? <Lock size={10} strokeWidth={2.4} className="text-dim" /> : null}
            {del.namn}
          </div>
          <div className="mt-1 text-[length:var(--fs-10)] text-dim">vikt {del.max}</div>
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <p className="truncate text-[length:var(--fs-11-5)] text-dim">{del.fraga}</p>
          <div className="mt-2">
            <Bar andel={andel} ton={last ? "dim" : (ton as "ok" | "warn" | "bad")} hojd={3} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {last ? (
            <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-tight)] text-dim">
              Låst
            </span>
          ) : (
            <span className="text-[length:var(--fs-17)] font-bold tabular-nums text-bone">
              {poang}
              <span className="text-[length:var(--fs-11)] font-medium text-dim"> / {del.max}</span>
            </span>
          )}
          {!last ? (
            <ChevronDown
              size={13}
              strokeWidth={2.2}
              className={`shrink-0 text-dim transition-transform duration-200 ${
                oppen ? "rotate-180" : ""
              }`}
            />
          ) : (
            <span className="w-[13px]" />
          )}
        </div>
      </button>

      {last ? (
        <div className="px-5 pb-4 md:pl-[176px]">
          <div className="border border-dashed border-line bg-page/35 px-4 py-3">
            <p className="text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body">{del.last!.text}</p>
            <p className="mt-1.5 text-[length:var(--fs-11)] leading-[var(--lh-body)] text-dim">
              Visas som låst, inte som noll. Skillnaden mellan att vi inte vet och att det
              är dåligt avgör om du fortsätter.
            </p>
          </div>
        </div>
      ) : null}

      {oppen && !last ? (
        <div className="expand px-5 pb-5 md:pl-[176px]">
          <div className="space-y-3.5">
            {del.rader.map((r) => (
              <div key={r.rubrik} className="border-l border-line pl-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[length:var(--fs-11-5)] label-caps tracking-[var(--track-label-tight)] text-bone">
                    {r.rubrik}
                  </span>
                  <span className="text-[length:var(--fs-12)] font-semibold tabular-nums text-body">
                    {r.poang} <span className="text-dim">/ {r.max}</span>
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {r.rader.map((t, i) => (
                    <li key={i} className="text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <SourceChip kalla={r.kalla} />
                </div>
              </div>
            ))}
          </div>
          {del.slutsats ? (
            <p className="mt-4 border-l-2 border-slab/50 pl-3.5 text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-bone">
              {del.slutsats}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Forslag() {
  const { total } = useDemo();
  return (
    <Panel className="rise">
      <PanelHead
        titel="Höj din poäng"
        hoger={
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
            nu {total} / 100 · sorterat efter poäng per insats
          </span>
        }
      />
      <ul>
        {suggestions.map((s) => (
          <li
            key={s.id}
            className="grid gap-4 border-b border-linesoft px-5 py-4 last:border-b-0 sm:grid-cols-[62px_minmax(0,1fr)_auto]"
          >
            <div className="text-[length:var(--fs-21)] font-bold leading-none tabular-nums text-ok">
              +{s.okning}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-[length:var(--fs-13-5)] font-semibold text-bone">{s.rubrik}</h3>
                <span className="text-[length:var(--fs-10-5)] text-dim">{s.tid}</span>
                <Marke ton={s.lucka === "underlag" ? "dim" : "warn"}>
                  {gapLabels[s.lucka].namn}
                </Marke>
              </div>
              {s.motivering.map((m, i) => (
                <p key={i} className="mt-1.5 max-w-[68ch] text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body">
                  {m}
                </p>
              ))}
              {s.register ? (
                <p className="mt-2 text-[length:var(--fs-11)] text-slab">{s.register}</p>
              ) : null}
            </div>
            <div className="sm:self-center">
              <Knapp variant="sekundar">{s.knapp}</Knapp>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-line bg-page/40 px-5 py-4">
        <div className="flex items-center gap-2 text-bad">
          <AlertTriangle size={12} strokeWidth={2.3} />
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)]">
            {structuralGap.rubrik}
          </span>
        </div>
        <p className="mt-2.5 max-w-[72ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
          {structuralGap.text}
        </p>
        <ul className="mt-3 space-y-1.5">
          {structuralGap.atgarder.map((a, i) => (
            <li key={i} className="flex gap-2.5 text-[length:var(--fs-12)] leading-[var(--lh-body)] text-dim">
              <span className="mt-[9px] h-px w-3 shrink-0 bg-line" />
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <SourceChip kalla={structuralGap.kalla} />
        </div>
      </div>

      <div className="border-t border-linesoft px-5 py-3">
        <p className="max-w-[80ch] text-[length:var(--fs-11)] leading-[var(--lh-body)] text-dim">
          Förslag får aldrig höja poängen utan att öka kunskapen. Svar fem till tio är
          värda mycket, svar tjugo till trettio nästan ingenting — och ett nej väger lika
          tungt som ett ja.
        </p>
      </div>
    </Panel>
  );
}

/* —— Variant b för toppen: en kompakt rad i stället för ett textblock —— */
function ToppenRad() {
  const { total, previous, sinceLast } = useDemo();
  const niva = levelFor(total);
  const ton = niva.farg === "ok" ? "text-ok" : niva.farg === "warn" ? "text-warn" : "text-bad";
  return (
    <Panel className="rise">
      <div className="flex flex-wrap items-center gap-5 px-5 py-4">
        <div className="flex items-baseline gap-1.5">
          <CountUp from={previous} to={total} className={`text-[length:var(--fs-30)] font-bold leading-none tabular-nums ${ton}`} />
          <span className="text-[length:var(--fs-12)] text-dim">/ 100</span>
        </div>
        <Marke ton={niva.farg as "ok" | "warn" | "bad"}>{niva.namn}</Marke>
        <span className="flex items-center gap-1.5 text-[length:var(--fs-11)] text-ok">
          <TrendingUp size={11} strokeWidth={2.4} /> +{sinceLast} sedan måndag
        </span>
        <span className="ml-auto text-[length:var(--fs-11)] text-dim">
          Räknas i kod ur strukturerad data · varje poäng har en källa
        </span>
      </div>
    </Panel>
  );
}

/* —— Variant b för delarna: rutnät i stället för utfällbar lista —— */
function DelarRutnat() {
  const { parts } = useDemo();
  return (
    <Panel className="rise">
      <PanelHead titel="De åtta delarna" hoger={<span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">rutnät</span>} />
      <div className="grid gap-px bg-linesoft sm:grid-cols-2 lg:grid-cols-4">
        {scoreParts.map((p) => {
          const v = parts[p.nyckel];
          const last = Boolean(p.last);
          const andel = (v / p.max) * 100;
          const ton = last ? "dim" : andel >= 75 ? "ok" : andel >= 45 ? "warn" : "bad";
          return (
            <div key={p.nyckel} className="bg-panel/55 px-4 py-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-tight)] text-bone">
                  {p.namn}
                </span>
                {last ? (
                  <Lock size={10} strokeWidth={2.4} className="shrink-0 text-dim" />
                ) : (
                  <span className="text-[length:var(--fs-13)] font-bold tabular-nums text-bone">
                    {v}<span className="text-[length:var(--fs-10)] font-medium text-dim">/{p.max}</span>
                  </span>
                )}
              </div>
              <div className="mt-2.5">
                <Bar andel={andel} ton={ton as "ok" | "warn" | "bad" | "dim"} hojd={3} />
              </div>
              <p className="mt-2.5 text-[length:var(--fs-10-5)] leading-[var(--lh-tight)] text-dim">
                {last ? p.last!.text : p.fraga}
              </p>
              {!last ? (
                <ul className="mt-2.5 flex flex-col gap-1">
                  {p.rader.map((r) => (
                    <li key={r.rubrik} className="flex items-baseline justify-between gap-2 text-[length:var(--fs-10-5)] text-body">
                      <span className="min-w-0 truncate">{r.rubrik}</span>
                      <span className="shrink-0 tabular-nums text-dim">{r.poang}/{r.max}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default function Poangen() {
  return (
    <div>
      <PageTitle
        eyebrow="Poängen"
        titel="Bevisgrad, inte idékvalitet"
        ingress="Poängen är en summa av vad som faktiskt går att belägga — inte ett omdöme om hur lovande idén låter. Åtta delar, var och en nedbruten till de siffror och svar den vilar på."
      />

      <div className="flex flex-col gap-5">
        <div
          data-section="toppen"
          data-section-name="Toppen"
          data-col="huvud"
          data-col-name="Poängvyn"
          data-variant-group="poang-topp"
          data-variants="a:Med förklaring|b:Kompakt rad"
        >
          <div data-variant="a"><Toppen /></div>
          <div data-variant="b"><ToppenRad /></div>
        </div>

        <div
          data-section="delarna"
          data-section-name="De åtta delarna"
          data-col="huvud"
          data-col-name="Poängvyn"
          data-variant-group="poang-delar"
          data-variants="a:Utfällbar lista|b:Rutnät"
        >
          <div data-variant="a">
            <Panel className="rise">
              <PanelHead
                titel="De åtta delarna"
                hoger={
                  <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
                    Klicka för att fälla ut
                  </span>
                }
              />
              {scoreParts.map((p) => (
                <Del key={p.nyckel} nyckel={p.nyckel} />
              ))}
              <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
                <Eyebrow>Summa</Eyebrow>
                <Summa />
              </div>
            </Panel>
          </div>
          <div data-variant="b"><DelarRutnat /></div>
        </div>

        <div data-section="fastak" data-section-name="Taken per fas" data-col="huvud" data-col-name="Poängvyn">
          <Fastak />
        </div>

        <div data-section="forslag" data-section-name="Höj din poäng" data-col="huvud" data-col-name="Poängvyn">
          <Forslag />
        </div>
      </div>
    </div>
  );
}

function Summa() {
  const { total, previous } = useDemo();
  return (
    <span className="text-[length:var(--fs-19)] font-bold tabular-nums text-bone">
      <CountUp from={previous} to={total} />
      <span className="text-[length:var(--fs-12)] font-medium text-dim"> / 100</span>
    </span>
  );
}
