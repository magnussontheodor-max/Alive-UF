"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mail,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useDemo } from "@/components/DemoState";
import { Bar, CountUp, Knapp, Marke, Panel, PanelHead, SourceChip } from "@/components/ui";
import { currentCap, levelFor, scoreParts } from "@/data/score";
import { greeting } from "@/data/home";
import { pulse } from "@/data/pulse";

function Poangmatare() {
  const { total, previous, sinceLast, parts } = useDemo();
  const niva = levelFor(total);
  const ton = niva.farg === "ok" ? "text-ok" : niva.farg === "warn" ? "text-warn" : "text-bad";
  const barTon = niva.farg === "ok" ? "ok" : niva.farg === "warn" ? "warn" : "bad";

  return (
    <Panel className="rise">
      <div className="flex flex-wrap items-start justify-between gap-5 px-5 py-5">
        <div className="flex items-start gap-5">
          <div className="flex items-baseline gap-1.5">
            <CountUp
              from={previous}
              to={total}
              className={`text-[length:var(--fs-54)] font-bold leading-none tabular-nums ${ton}`}
            />
            <span className="text-[length:var(--fs-15)] leading-none text-dim">/ 100</span>
          </div>
          <div className="pt-1.5">
            <div className="text-[length:var(--fs-12)] label-caps tracking-[var(--track-label)] text-bone">
              {niva.namn}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[length:var(--fs-11)] text-ok">
              <TrendingUp size={12} strokeWidth={2.4} />
              <span>+{sinceLast} sedan måndag</span>
            </div>
            <p className="mt-2.5 max-w-[42ch] text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body">
              {niva.sager}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
            {greeting.hälsning}
          </div>
          <div className="mt-1.5 text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-slab">
            {greeting.läge}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="relative">
          <Bar andel={total} ton={barTon as "ok" | "warn" | "bad"} hojd={5} />
          <span
            className="absolute -top-1 h-[13px] w-px bg-dim"
            style={{ left: `${currentCap}%` }}
          />
        </div>
        <div className="relative mt-2 h-4">
          <span className="absolute left-0 top-0 text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label-tight)] text-dim">
            Poängen mäter hur mycket som är bevisat
          </span>
          <span
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label-tight)] text-dim"
            style={{ left: `${currentCap}%` }}
          >
            Tak i fasen Pröva · 66
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-linesoft bg-linesoft sm:grid-cols-4">
        {scoreParts.slice(0, 4).map((p) => {
          const v = parts[p.nyckel];
          return (
            <div key={p.nyckel} className="bg-panel/55 px-4 py-3">
              <div className="text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label)] text-dim">
                {p.namn}
              </div>
              <div className="mt-1.5 text-[length:var(--fs-15)] font-semibold tabular-nums text-bone">
                {v}
                <span className="text-[length:var(--fs-11)] text-dim"> / {p.max}</span>
              </div>
              <div className="mt-2">
                <Bar andel={(v / p.max) * 100} hojd={3} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function NastaSteg() {
  const { currentStep, completeStep, deferStep, deferred, doneCount } = useDemo();
  const [oppet, setOppet] = useState(false);
  const sist = Boolean(currentStep.sist);

  return (
    <Panel
      key={currentStep.id}
      className="rise border-slab/35 bg-[var(--panel)]/70"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slab/20 px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <Sparkles size={13} strokeWidth={2.2} className="text-slab" />
          <h2 className="text-[length:var(--fs-11)] label-caps tracking-[var(--track-label-wide)] text-slab">
            Nästa steg
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {doneCount > 0 ? (
            <Marke ton="ok">
              <Check size={9} strokeWidth={3} /> {doneCount} klarade i dag
            </Marke>
          ) : null}
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
            {currentStep.steg}
          </span>
        </div>
      </div>

      <div className="px-5 py-6">
        <h3 className="max-w-[26ch] text-[length:var(--fs-27)] font-bold leading-[var(--lh-head)] tracking-[var(--track-head)] text-bone">
          {currentStep.rubrik}
        </h3>
        <p className="mt-3 max-w-[52ch] text-[length:var(--fs-14)] leading-[var(--lh-body)] text-body">
          {currentStep.underrubrik}
        </p>

        <div className="mt-6 border-l-2 border-slab/45 pl-4">
          <div className="eyebrow mb-2">Varför</div>
          {currentStep.varfor.map((v, i) => (
            <p key={i} className="mb-2 max-w-[62ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body last:mb-0">
              {v}
            </p>
          ))}
        </div>

        {oppet ? (
          <div className="expand mt-5 border border-linesoft bg-page/45 px-4 py-4">
            <div className="eyebrow mb-3">{currentStep.underlag.rubrik}</div>
            <ul className="space-y-2">
              {currentStep.underlag.rader.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[length:var(--fs-12)] leading-[var(--lh-body)] text-body"
                >
                  <span className="mt-[7px] h-px w-3 shrink-0 bg-dim" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3.5">
              <SourceChip kalla={currentStep.underlag.kalla} />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {sist ? (
            <Link href="/valideringen">
              <Knapp variant="primar">
                Öppna domen <ArrowRight size={12} strokeWidth={2.4} />
              </Knapp>
            </Link>
          ) : (
            <Knapp variant="primar" onClick={completeStep}>
              <Check size={12} strokeWidth={3} /> Klar
            </Knapp>
          )}
          <Knapp variant="sekundar" onClick={deferStep} disabled={sist || deferred}>
            {deferred ? "Skjutet till i morgon" : "Senare"}
          </Knapp>
          <Knapp variant="tyst" onClick={() => setOppet((o) => !o)}>
            Visa underlaget
            <ChevronDown
              size={12}
              strokeWidth={2.4}
              className={`transition-transform duration-200 ${oppet ? "rotate-180" : ""}`}
            />
          </Knapp>
          {!sist && currentStep.okning > 0 ? (
            <span className="ml-auto text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
              Ger upp till +{currentStep.okning} poäng
            </span>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

const sparIkon = {
  svar: Mail,
  register: Sparkles,
  poang: TrendingUp,
  verktyg: Check,
} as const;

function SedanSist() {
  const { trail } = useDemo();
  return (
    <Panel className="rise">
      <PanelHead titel="Sedan sist" />
      <ul>
        {trail.slice(0, 5).map((t) => {
          const Ikon = sparIkon[t.typ];
          return (
            <li
              key={t.id}
              className="fade flex items-start gap-3 border-b border-linesoft px-4 py-3 last:border-b-0"
            >
              <Ikon
                size={12}
                strokeWidth={2.2}
                className={`mt-[3px] shrink-0 ${
                  t.typ === "poang" ? "text-ok" : "text-dim"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[length:var(--fs-12-5)] leading-[var(--lh-tight)] text-body">{t.text}</p>
              </div>
              <span className="shrink-0 text-[length:var(--fs-10)] whitespace-nowrap text-dim">
                {t.tid}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-linesoft px-4 py-2.5">
        <span className="text-[length:var(--fs-10)] leading-relaxed text-dim">
          Spåret skrivs av verktygen. Du rapporterar aldrig.
        </span>
      </div>
    </Panel>
  );
}

function Pulsen() {
  const tonIkon = { ok: TrendingUp, bad: TrendingDown, warn: Clock, neutral: Clock };
  return (
    <Panel className="rise">
      <PanelHead
        titel="Pulsen"
        hoger={
          <span className="flex items-center gap-1.5 text-[length:var(--fs-9-5)] label-caps tracking-[var(--track-label)] text-dim">
            <span className="pulsedot h-1.5 w-1.5 rounded-full bg-ok" />
            14 september
          </span>
        }
      />
      <ul>
        {pulse.map((s) => {
          const Ikon = tonIkon[s.ton];
          const ton =
            s.ton === "ok" ? "text-ok" : s.ton === "bad" ? "text-bad" : "text-warn";
          return (
            <li key={s.id} className="border-b border-linesoft px-4 py-4 last:border-b-0">
              <div className="flex items-start gap-2.5">
                <Ikon size={12} strokeWidth={2.3} className={`mt-[3px] shrink-0 ${ton}`} />
                <h3 className="text-[length:var(--fs-12-5)] font-semibold leading-[var(--lh-tight)] text-bone">
                  {s.rubrik}
                </h3>
              </div>
              <p className="mt-2 text-[length:var(--fs-11-5)] leading-[var(--lh-body)] text-dim">{s.brod}</p>
              <p className="mt-2.5 border-l border-slab/40 pl-2.5 text-[length:var(--fs-11-5)] leading-[var(--lh-body)] text-body">
                {s.varfor}
              </p>
              <div className="mt-3">
                <SourceChip kalla={s.kalla} />
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* —— Variant b för poängmätaren: ring och lista i stället för mätare —— */
function PoangmatareRing() {
  const { total, previous, sinceLast, parts } = useDemo();
  const niva = levelFor(total);
  const ton = niva.farg === "ok" ? "text-ok" : niva.farg === "warn" ? "text-warn" : "text-bad";
  const stroke = niva.farg === "ok" ? "var(--ok)" : niva.farg === "warn" ? "var(--warn)" : "var(--bad)";
  const omkrets = 2 * Math.PI * 52;

  return (
    <Panel className="rise">
      <div className="flex flex-wrap items-center gap-7 px-5 py-6">
        <div className="relative h-[124px] w-[124px] shrink-0">
          <svg width="124" height="124" viewBox="0 0 124 124" className="-rotate-90">
            <circle cx="62" cy="62" r="52" fill="none" stroke="var(--line-soft)" strokeWidth="9" />
            <circle
              cx="62"
              cy="62"
              r="52"
              fill="none"
              stroke={stroke}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={omkrets}
              strokeDashoffset={omkrets * (1 - total / 100)}
              className="transition-[stroke-dashoffset] duration-[900ms] ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CountUp from={previous} to={total} className={`text-[length:var(--fs-34)] font-bold leading-none tabular-nums ${ton}`} />
            <span className="text-[length:var(--fs-10)] text-dim">av 100</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[length:var(--fs-12)] label-caps tracking-[var(--track-label)] text-bone">
              {niva.namn}
            </span>
            <span className="flex items-center gap-1.5 text-[length:var(--fs-11)] text-ok">
              <TrendingUp size={12} strokeWidth={2.4} />+{sinceLast} sedan måndag
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {scoreParts.filter((p) => !p.last).map((p) => (
              <div key={p.nyckel} className="flex items-center gap-3">
                <span className="w-[118px] shrink-0 text-[length:var(--fs-11)] text-body">{p.namn}</span>
                <span className="min-w-0 flex-1"><Bar andel={(parts[p.nyckel] / p.max) * 100} hojd={3} /></span>
                <span className="w-[46px] shrink-0 text-right text-[length:var(--fs-11)] tabular-nums text-dim">
                  <span className="text-bone">{parts[p.nyckel]}</span>/{p.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* —— Variant b för nästa steg: en rad med underlaget alltid framme —— */
function NastaStegRad() {
  const { currentStep, completeStep, doneCount } = useDemo();
  const sist = Boolean(currentStep.sist);

  return (
    <Panel className="rise border-slab/35 bg-[var(--panel)]">
      <div className="flex flex-wrap items-center gap-4 px-5 py-4">
        <Sparkles size={14} strokeWidth={2.2} className="shrink-0 text-slab" />
        <h3 className="min-w-0 flex-1 text-[length:var(--fs-17)] font-bold leading-[var(--lh-head)] text-bone">
          {currentStep.rubrik}
        </h3>
        {doneCount > 0 ? <Marke ton="ok"><Check size={9} strokeWidth={3} /> {doneCount} i dag</Marke> : null}
        {sist ? (
          <Link href="/valideringen"><Knapp variant="primar">Öppna domen</Knapp></Link>
        ) : (
          <Knapp variant="primar" onClick={completeStep}><Check size={12} strokeWidth={3} /> Klar</Knapp>
        )}
      </div>
      <div className="grid gap-5 border-t border-linesoft px-5 py-4 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-2">Varför</div>
          {currentStep.varfor.map((v, i) => (
            <p key={i} className="mb-2 text-[length:var(--fs-12)] leading-[var(--lh-relaxed)] text-body last:mb-0">{v}</p>
          ))}
        </div>
        <div>
          <div className="eyebrow mb-2">{currentStep.underlag.rubrik}</div>
          <ul className="flex flex-col gap-1.5">
            {currentStep.underlag.rader.map((r, i) => (
              <li key={i} className="text-[length:var(--fs-11)] leading-[var(--lh-tight)] text-dim">{r}</li>
            ))}
          </ul>
          <div className="mt-3"><SourceChip kalla={currentStep.underlag.kalla} /></div>
        </div>
      </div>
    </Panel>
  );
}

export default function Hem() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-5">
        <div
          data-section="poangmatare"
          data-section-name="Poängmätaren"
          data-col="huvud"
          data-col-name="Huvudspalt"
          data-variant-group="hem-poang"
          data-variants="a:Mätare|b:Ring och lista"
        >
          <div data-variant="a"><Poangmatare /></div>
          <div data-variant="b"><PoangmatareRing /></div>
        </div>

        <div
          data-section="nastasteg"
          data-section-name="Nästa steg"
          data-col="huvud"
          data-col-name="Huvudspalt"
          data-variant-group="hem-steg"
          data-variants="a:Stor rubrik|b:Rad med underlag"
        >
          <div data-variant="a"><NastaSteg /></div>
          <div data-variant="b"><NastaStegRad /></div>
        </div>

        <div data-section="sedansist" data-section-name="Sedan sist" data-col="huvud" data-col-name="Huvudspalt">
          <SedanSist />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <div data-section="pulsen" data-section-name="Pulsen" data-col="sido" data-col-name="Sidospalt">
          <Pulsen />
        </div>
      </div>
    </div>
  );
}
