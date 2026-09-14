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
            className={`text-[64px] font-bold leading-none tabular-nums ${ton}`}
          />
          <span className="text-[17px] text-dim">/ 100</span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Marke ton={niva.farg as "ok" | "warn" | "bad"}>{niva.namn}</Marke>
            <span className="flex items-center gap-1.5 text-[11px] text-ok">
              <TrendingUp size={11} strokeWidth={2.4} /> +{sinceLast} sedan måndag
            </span>
          </div>
          <p className="mt-3 max-w-[66ch] text-[13px] leading-[1.7] text-body">
            Poängen mäter hur mycket som är <span className="text-bone">bevisat</span>,
            inte hur bra idén låter. Den räknas i kod ur strukturerad data — modellen
            läser svaren och drar ut fakta, beräkningen sker i en vanlig funktion. Varje
            poäng har en källa och ett datum. Finns ingen källa ges ingen poäng.
          </p>
          <p className="mt-2.5 max-w-[66ch] text-[12px] leading-[1.7] text-dim">
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
          <span className="text-[10px] label-caps tracking-[0.12em] text-dim">
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
                  <span className="text-[9.5px] label-caps tracking-[0.11em] text-dim">
                    {f.fas}
                  </span>
                  <span
                    className={`text-[15px] font-bold tabular-nums ${
                      passerad ? "text-ok" : aktuell ? "text-slab" : "text-dim"
                    }`}
                  >
                    {f.tak}
                  </span>
                </div>
                <div className="mt-1 text-[9.5px] text-dim">Steg {f.steg}</div>
                <p className="mt-2.5 text-[11px] leading-[1.55] text-body">{f.text}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 max-w-[78ch] border-l-2 border-slab/45 pl-3.5 text-[12px] leading-[1.7] text-body">
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
          <div className="flex items-center gap-2 text-[12px] label-caps tracking-[0.11em] text-bone">
            {last ? <Lock size={10} strokeWidth={2.4} className="text-dim" /> : null}
            {del.namn}
          </div>
          <div className="mt-1 text-[10px] text-dim">vikt {del.max}</div>
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <p className="truncate text-[11.5px] text-dim">{del.fraga}</p>
          <div className="mt-2">
            <Bar andel={andel} ton={last ? "dim" : (ton as "ok" | "warn" | "bad")} hojd={3} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {last ? (
            <span className="text-[10px] label-caps tracking-[0.11em] text-dim">
              Låst
            </span>
          ) : (
            <span className="text-[17px] font-bold tabular-nums text-bone">
              {poang}
              <span className="text-[11px] font-medium text-dim"> / {del.max}</span>
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
            <p className="text-[12px] leading-[1.6] text-body">{del.last!.text}</p>
            <p className="mt-1.5 text-[11px] leading-[1.6] text-dim">
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
                  <span className="text-[11.5px] label-caps tracking-[0.1em] text-bone">
                    {r.rubrik}
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums text-body">
                    {r.poang} <span className="text-dim">/ {r.max}</span>
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {r.rader.map((t, i) => (
                    <li key={i} className="text-[12px] leading-[1.6] text-body">
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
            <p className="mt-4 border-l-2 border-slab/50 pl-3.5 text-[12.5px] leading-[1.65] text-bone">
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
          <span className="text-[10px] label-caps tracking-[0.12em] text-dim">
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
            <div className="text-[21px] font-bold leading-none tabular-nums text-ok">
              +{s.okning}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-[13.5px] font-semibold text-bone">{s.rubrik}</h3>
                <span className="text-[10.5px] text-dim">{s.tid}</span>
                <Marke ton={s.lucka === "underlag" ? "dim" : "warn"}>
                  {gapLabels[s.lucka].namn}
                </Marke>
              </div>
              {s.motivering.map((m, i) => (
                <p key={i} className="mt-1.5 max-w-[68ch] text-[12px] leading-[1.6] text-body">
                  {m}
                </p>
              ))}
              {s.register ? (
                <p className="mt-2 text-[11px] text-slab">{s.register}</p>
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
          <span className="text-[10px] label-caps tracking-[0.13em]">
            {structuralGap.rubrik}
          </span>
        </div>
        <p className="mt-2.5 max-w-[72ch] text-[12.5px] leading-[1.65] text-body">
          {structuralGap.text}
        </p>
        <ul className="mt-3 space-y-1.5">
          {structuralGap.atgarder.map((a, i) => (
            <li key={i} className="flex gap-2.5 text-[12px] leading-[1.6] text-dim">
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
        <p className="max-w-[80ch] text-[11px] leading-[1.6] text-dim">
          Förslag får aldrig höja poängen utan att öka kunskapen. Svar fem till tio är
          värda mycket, svar tjugo till trettio nästan ingenting — och ett nej väger lika
          tungt som ett ja.
        </p>
      </div>
    </Panel>
  );
}

export default function Poangen() {
  return (
    <div className="space-y-5">
      <PageTitle
        eyebrow="Poängen"
        titel="Bevisgrad, inte idékvalitet"
        ingress="Poängen är en summa av vad som faktiskt går att belägga — inte ett omdöme om hur lovande idén låter. Åtta delar, var och en nedbruten till de siffror och svar den vilar på."
      />

      <Toppen />

      <Panel className="rise">
        <PanelHead
          titel="De åtta delarna"
          hoger={
            <span className="text-[10px] label-caps tracking-[0.12em] text-dim">
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

      <Fastak />
      <Forslag />
    </div>
  );
}

function Summa() {
  const { total, previous } = useDemo();
  return (
    <span className="text-[19px] font-bold tabular-nums text-bone">
      <CountUp from={previous} to={total} />
      <span className="text-[12px] font-medium text-dim"> / 100</span>
    </span>
  );
}
